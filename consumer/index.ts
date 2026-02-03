import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { config } from './config';

const sqs = new SQSClient({ region: config.aws.region });

// Initialize DynamoDB
const client = new DynamoDBClient({ region: config.aws.region });
const docClient = DynamoDBDocumentClient.from(client);

interface Article {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    source: string;
    guid?: string;
    fetchedAt: string;
}

const saveToDynamoDB = async (article: Article) => {
    const command = new PutCommand({
        TableName: config.aws.tableName,
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
    } catch (err) {
        console.error('❌ Error saving to DynamoDB:', err);
    }
};

export const runConsumer = async () => {
    console.log('🚀 Starting SQS Consumer...');

    try {
        if (!config.aws.sqsQueueUrl) {
            throw new Error('SQS_QUEUE_URL is not set');
        }

        while (true) {
            const response = await sqs.send(new ReceiveMessageCommand({
                QueueUrl: config.aws.sqsQueueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 20,
            }));

            const messages = response.Messages || [];
            if (messages.length === 0) {
                continue;
            }

            for (const message of messages) {
                if (!message.Body || !message.ReceiptHandle) continue;

                try {
                    const article = JSON.parse(message.Body) as Article;
                    console.log(`📥 Received: ${article.title}`);

                    // Simple Filter: Check if title contains AI keywords (Basic example)
                    // (The Producer already fetches from AI sources, but we can double check)
                    const keywords = ['AI', 'GPT', 'LLM', 'Machine Learning', 'Neural', 'DeepMind', 'OpenAI'];
                    const isRelevant = keywords.some(k =>
                        article.title.includes(k) || article.contentSnippet?.includes(k)
                    );

                    if (isRelevant) {
                        await saveToDynamoDB(article);
                    } else {
                        console.log(`Skipped (Not relevant): ${article.title}`);
                    }

                    await sqs.send(new DeleteMessageCommand({
                        QueueUrl: config.aws.sqsQueueUrl,
                        ReceiptHandle: message.ReceiptHandle,
                    }));
                } catch (err) {
                    console.error('❌ Error processing message:', err);
                }
            }
        }

    } catch (error) {
        console.error('❌ Critical Consumer Error:', error);
    }
};

if (require.main === module) {
    runConsumer();
}
