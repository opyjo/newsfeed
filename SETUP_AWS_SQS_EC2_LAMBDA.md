# Newsfeed AWS Setup (Lambda Producer + SQS + EC2 Consumer)

This guide documents the complete setup for the Newsfeed app using:

- **Producer**: AWS Lambda (runs on a schedule)
- **Queue**: Amazon SQS (Standard)
- **Consumer**: EC2 (always on via systemd)
- **Database**: DynamoDB

The goal: Lambda fetches RSS and pushes items to SQS. EC2 pulls from SQS and writes to DynamoDB. The frontend reads DynamoDB.

---

## 0) Prerequisites

- AWS account
- A Git repo with this project
- Region assumed: `us-east-1` (adjust if you use another)

---

## 1) Create the SQS Queue

1) Open the SQS console.
2) Create **Standard** queue.
3) Name it (example): `ai-news-raw`.
4) Create.
5) Copy the **Queue URL** and **Queue ARN** (you will need both).

Example Queue URL:

```
https://sqs.us-east-1.amazonaws.com/123456789012/ai-news-raw
```

---

## 2) Create DynamoDB Table

Create a table named `AINewsArticles` with:

- **Partition key**: `id` (String)
- **Sort key**: `publishedAt` (String)

This matches the consumer code.

---

## 3) Lambda Producer

### 3.1 Create Lambda Function

1) Lambda console -> Create function -> Author from scratch.
2) Runtime: **Node.js 20** (or 22/24).
3) Create function.

### 3.2 Add SQS Permission to Lambda Role

Attach policy (fast for learning) **AmazonSQSFullAccess** to the Lambda execution role.

If you cannot attach AWS-managed policies, add an inline policy using the queue ARN:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSendToQueue",
      "Effect": "Allow",
      "Action": ["sqs:SendMessage", "sqs:SendMessageBatch"],
      "Resource": "arn:aws:sqs:us-east-1:123456789012:ai-news-raw"
    }
  ]
}
```

### 3.3 Package and Upload Producer Code

On your local machine:

```
cd /Users/opyjo/Desktop/apps/newsfeed/producer
npm install
npx tsc
zip -r ../producer.zip index.js config.js node_modules package.json package-lock.json
```

In Lambda:

1) Code -> Upload from -> `.zip` -> select `producer.zip`.
2) Handler must be:

```
index.fetchAndProduce
```

### 3.4 Lambda Environment Variables

Set **only**:

```
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/ai-news-raw
```

Do **not** set `AWS_REGION` in Lambda (reserved key).

### 3.5 Increase Timeout

RSS fetching needs time. Set **Timeout** to 30 seconds (or 1 minute).

### 3.6 Test

Create a test event with `{}` and run. Check CloudWatch logs.

---

## 4) Schedule Lambda (EventBridge)

Create a schedule to run every 15 minutes:

- Target: your Lambda function
- Rate: `rate(15 minutes)`

This runs the producer automatically.

---

## 5) EC2 Consumer

### 5.1 Create IAM Role for EC2

Create an EC2 role with:

- SQS permissions (read + delete)
- DynamoDB permissions (write)
- Optional: `AmazonSSMManagedInstanceCore` for Session Manager

For learning, you can attach AWS-managed:

- `AmazonSQSFullAccess`
- `AmazonDynamoDBFullAccess`
- `AmazonSSMManagedInstanceCore`

### 5.2 Launch EC2

Recommended:

- AMI: Amazon Linux 2023
- Instance type: t3.micro
- Attach the IAM role above
- Security group: allow SSH (port 22) from **My IP**

### 5.3 Connect (SSH)

From your computer:

```
chmod 400 ~/Downloads/newsfeed-dev-ec2.pem
ssh -i ~/Downloads/newsfeed-dev-ec2.pem ec2-user@<public-ip>
```

### 5.4 Install Tools

```
sudo dnf update -y
sudo dnf install -y git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 5.5 Clone Repo

```
git clone https://github.com/opyjo/newsfeed.git /home/ec2-user/newsfeed
```

### 5.6 Configure Consumer Env

```
cd /home/ec2-user/newsfeed/consumer
cp .env.example .env
nano .env
```

Set:

```
AWS_REGION=us-east-1
DYNAMODB_TABLE=AINewsArticles
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/ai-news-raw
```

### 5.7 Install and Run

```
npm install
npx ts-node index.ts
```

You should see logs like:

```
🚀 Starting SQS Consumer...
📥 Received: ...
```

---

## 6) Keep Consumer Running Automatically (systemd)

Create service:

```
sudo tee /etc/systemd/system/newsfeed-consumer.service > /dev/null <<'EOF'
[Unit]
Description=Newsfeed SQS Consumer
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/newsfeed/consumer
EnvironmentFile=/home/ec2-user/newsfeed/consumer/.env
ExecStart=/bin/bash -lc 'cd /home/ec2-user/newsfeed/consumer && npx ts-node index.ts'
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

Enable + start:

```
sudo systemctl daemon-reload
sudo systemctl enable newsfeed-consumer
sudo systemctl start newsfeed-consumer
sudo systemctl status newsfeed-consumer
```

Logs:

```
sudo journalctl -u newsfeed-consumer -f
```

Now it keeps running even after you close the terminal.

---

## 7) Verify End-to-End

1) Lambda test should log RSS fetches.
2) SQS should show messages arriving.
3) EC2 consumer logs should show messages received.
4) DynamoDB should show new items.
5) Frontend should show fresh articles.

---

## Troubleshooting

**Lambda times out**
- Increase timeout to 30-60 seconds.

**Lambda shows no SQS messages**
- Confirm `SQS_QUEUE_URL` matches exactly.
- Ensure Lambda role has SQS permissions.

**Consumer not processing**
- Check `journalctl -u newsfeed-consumer -f`.
- Confirm `.env` values.

**SSM not connecting**
- Ensure EC2 role has SSM policy and IMDS enabled.

---

## Notes / Security

- Do not store AWS keys in `.env` on EC2. Use IAM roles instead.
- Restrict SSH inbound to **your IP only**.
- Consider removing unused feeds if a feed regularly errors.

