import { Kafka } from 'kafkajs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { config } from './config';

// Initialize Kafka
const kafka = new Kafka({
    clientId: 'ai-news-consumer',
    brokers: config.kafka.brokers,
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: config.kafka.username,
        password: config.kafka.password,
    },
});

const consumer = kafka.consumer({ groupId: config.kafka.groupId });

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
    console.log('🚀 Starting Kafka Consumer...');

    try {
        await consumer.connect();
        await consumer.subscribe({ topic: config.kafka.topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (!message.value) return;

                try {
                    const article = JSON.parse(message.value.toString()) as Article;
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

                } catch (err) {
                    console.error('❌ Error processing message:', err);
                }
            },
        });

    } catch (error) {
        console.error('❌ Critical Consumer Error:', error);
    }
};

if (require.main === module) {
    runConsumer();
}
