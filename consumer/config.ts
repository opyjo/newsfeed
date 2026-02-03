import dotenv from 'dotenv';

dotenv.config();

export const config = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        tableName: process.env.DYNAMODB_TABLE || 'AINewsArticles',
        sqsQueueUrl: process.env.SQS_QUEUE_URL || '',
    },
};
