import dotenv from 'dotenv';

dotenv.config();

export const config = {
    kafka: {
        brokers: (process.env.KAFKA_BROKERS || '').split(','),
        username: process.env.KAFKA_USERNAME || '',
        password: process.env.KAFKA_PASSWORD || '',
        groupId: 'ai-news-consumer-group',
        topic: process.env.KAFKA_TOPIC_RAW || 'raw_articles',
    },
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        tableName: process.env.DYNAMODB_TABLE || 'AINewsArticles',
    },
};
