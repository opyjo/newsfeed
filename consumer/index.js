"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConsumer = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("./config");
const sqs = new client_sqs_1.SQSClient({ region: config_1.config.aws.region });
// Initialize DynamoDB
const client = new client_dynamodb_1.DynamoDBClient({ region: config_1.config.aws.region });
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const saveToDynamoDB = async (article) => {
    const command = new lib_dynamodb_1.PutCommand({
        TableName: config_1.config.aws.tableName,
        Item: {
            id: article.link,
            publishedAt: article.pubDate, // Required if Sort Key is defined
            ...article,
            processedAt: new Date().toISOString(),
        },
    });
    try {
        await docClient.send(command);
        console.log(`💾 Saved: ${article.title.substring(0, 50)}...`);
    }
    catch (err) {
        console.error('❌ Error saving to DynamoDB:', err);
    }
};
const runConsumer = async () => {
    console.log('🚀 Starting SQS Consumer...');
    try {
        if (!config_1.config.aws.sqsQueueUrl) {
            throw new Error('SQS_QUEUE_URL is not set');
        }
        while (true) {
            const response = await sqs.send(new client_sqs_1.ReceiveMessageCommand({
                QueueUrl: config_1.config.aws.sqsQueueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 20,
            }));
            const messages = response.Messages || [];
            if (messages.length === 0) {
                continue;
            }
            for (const message of messages) {
                if (!message.Body || !message.ReceiptHandle)
                    continue;
                try {
                    const article = JSON.parse(message.Body);
                    console.log(`📥 Received: ${article.title}`);
                    // Save all tech news articles (filtering removed for broader coverage)
                    await saveToDynamoDB(article);
                    await sqs.send(new client_sqs_1.DeleteMessageCommand({
                        QueueUrl: config_1.config.aws.sqsQueueUrl,
                        ReceiptHandle: message.ReceiptHandle,
                    }));
                }
                catch (err) {
                    console.error('❌ Error processing message:', err);
                }
            }
        }
    }
    catch (error) {
        console.error('❌ Critical Consumer Error:', error);
    }
};
exports.runConsumer = runConsumer;
if (require.main === module) {
    (0, exports.runConsumer)();
}
