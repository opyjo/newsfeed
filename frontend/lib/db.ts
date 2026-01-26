import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const config: any = {
    region: process.env.AWS_REGION || "us-east-1",
};

// Only add credentials if they are explicitly set in env (e.g. for Vercel deployment)
// Otherwise, it uses default provider chain (local ~/.aws/credentials)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
}

const client = new DynamoDBClient(config);

export const docClient = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = process.env.DYNAMODB_TABLE || "AINewsArticles";
