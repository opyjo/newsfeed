"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        tableName: process.env.DYNAMODB_TABLE || 'AINewsArticles',
        sqsQueueUrl: process.env.SQS_QUEUE_URL || '',
    },
};
