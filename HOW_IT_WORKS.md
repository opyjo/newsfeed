# How the Newsfeed System Works (Simple Explanation)

This document explains **what each part does** and **how data flows** through the system.

---

## Big Picture

There are four main pieces:

1) **Lambda Producer** – fetches RSS feeds and creates messages  
2) **SQS Queue** – stores those messages safely  
3) **EC2 Consumer** – reads messages and saves them to the database  
4) **DynamoDB** – database that the frontend reads

The frontend **never fetches RSS directly**. It only shows data already stored in DynamoDB.

---

## Data Flow (Step by Step)

```
RSS Feeds -> Lambda Producer -> SQS Queue -> EC2 Consumer -> DynamoDB -> Frontend
```

### 1) Lambda Producer (runs on a schedule)
- Runs every 15 minutes (EventBridge schedule).
- Downloads RSS feeds.
- Converts each article into a JSON message.
- Sends messages to SQS.

### 2) SQS Queue (the mailbox)
- Stores messages until the consumer reads them.
- If the consumer is offline, messages wait here.
- This prevents data loss and decouples producer from consumer.

### 3) EC2 Consumer (always on)
- Long-polls SQS for messages.
- For each message:
  - Parses the article JSON.
  - Filters by keywords.
  - Writes the article to DynamoDB.
  - Deletes the message from SQS.

### 4) DynamoDB (database)
- Stores articles with `id` and `publishedAt` keys.
- The frontend queries this table.

### 5) Frontend (read-only)
- Reads DynamoDB to display latest articles.
- Shows relative time and content snippets.

---

## Why This Design Works

- **Reliable:** SQS stores messages even if the consumer goes down.
- **Scalable:** You can run multiple consumers if needed.
- **Cost‑efficient:** Producer runs only when scheduled.
- **Simple:** Each component has one clear responsibility.

---

## What Runs Where

- **Lambda Producer:** AWS Lambda (serverless)
- **Queue:** Amazon SQS
- **Consumer:** EC2 (systemd service)
- **Database:** DynamoDB
- **Frontend:** Next.js app (reads DynamoDB)

---

## What Happens If Something Fails

**If Lambda fails:**  
No new messages are added until the next scheduled run.

**If Consumer fails:**  
Messages stay in SQS until the consumer comes back.

**If SQS is empty:**  
Consumer just waits.

**If a feed is broken:**  
Producer logs the error and continues with other feeds.

---

## Key Concepts (Plain Words)

- **Producer** = “the collector”
- **Queue** = “the mailbox”
- **Consumer** = “the sorter”
- **Database** = “the library”
- **Frontend** = “the display screen”

---

## Summary

The system keeps updating your news feed by:

1) Collecting new articles on a schedule  
2) Storing them safely in a queue  
3) Processing them continuously  
4) Saving them into the database  
5) Showing them on the frontend

