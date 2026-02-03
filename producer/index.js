"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndProduce = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const rss_parser_1 = __importDefault(require("rss-parser"));
const config_1 = require("./config");
const parser = new rss_parser_1.default();
const sqs = new client_sqs_1.SQSClient({ region: config_1.config.aws.region });
const fetchAndProduce = async () => {
    console.log('🚀 Starting RSS Fetcher...');
    try {
        if (!config_1.config.aws.sqsQueueUrl) {
            throw new Error('SQS_QUEUE_URL is not set');
        }
        const batch = [];
        let batchSeq = 0;
        const flushBatch = async () => {
            if (batch.length === 0)
                return;
            await sqs.send(new client_sqs_1.SendMessageBatchCommand({
                QueueUrl: config_1.config.aws.sqsQueueUrl,
                Entries: batch.splice(0, batch.length),
            }));
        };
        for (const feedConfig of config_1.config.feeds) {
            try {
                console.log(`Fetching ${feedConfig.name}...`);
                const feed = await parser.parseURL(feedConfig.url);
                // Get only the first 5 articles to avoid quota limits during dev
                const items = feed.items.slice(0, 5);
                for (const item of items) {
                    if (!item.title || !item.link)
                        continue;
                    const article = {
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate || new Date().toISOString(),
                        contentSnippet: item.contentSnippet || '',
                        source: feedConfig.name,
                        guid: item.guid || item.link,
                        fetchedAt: new Date().toISOString(),
                    };
                    batch.push({
                        Id: `msg-${batchSeq++}`,
                        MessageBody: JSON.stringify(article),
                    });
                    if (batch.length === 10) {
                        await flushBatch();
                    }
                }
            }
            catch (err) {
                console.error(`❌ Error fetching ${feedConfig.name}:`, err);
            }
        }
        await flushBatch();
    }
    catch (error) {
        console.error('❌ Critical Error:', error);
    }
};
exports.fetchAndProduce = fetchAndProduce;
// If running locally
if (require.main === module) {
    // Run immediately
    (0, exports.fetchAndProduce)();
    // Then run every 15 minutes
    const INTERVAL_MS = 15 * 60 * 1000;
    setInterval(() => {
        (0, exports.fetchAndProduce)();
    }, INTERVAL_MS);
    console.log(`🔄 Producer scheduled to run every ${INTERVAL_MS / 60000} minutes`);
}
