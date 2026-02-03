import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import Parser from 'rss-parser';
import { config } from './config';

const parser = new Parser();

const sqs = new SQSClient({ region: config.aws.region });

interface Article {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    source: string;
    guid?: string;
    fetchedAt: string;
}

export const fetchAndProduce = async () => {
    console.log('🚀 Starting RSS Fetcher...');

    try {
        if (!config.aws.sqsQueueUrl) {
            throw new Error('SQS_QUEUE_URL is not set');
        }

        const batch: { Id: string; MessageBody: string }[] = [];
        let batchSeq = 0;
        const flushBatch = async () => {
            if (batch.length === 0) return;
            await sqs.send(new SendMessageBatchCommand({
                QueueUrl: config.aws.sqsQueueUrl,
                Entries: batch.splice(0, batch.length),
            }));
        };

        for (const feedConfig of config.feeds) {
            try {
                console.log(`Fetching ${feedConfig.name}...`);
                const feed = await parser.parseURL(feedConfig.url);

                // Get only the first 5 articles to avoid quota limits during dev
                const items = feed.items.slice(0, 5);

                for (const item of items) {
                    if (!item.title || !item.link) continue;

                    const article: Article = {
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
            } catch (err) {
                console.error(`❌ Error fetching ${feedConfig.name}:`, err);
            }
        }

        await flushBatch();

    } catch (error) {
        console.error('❌ Critical Error:', error);
    }
};

// If running locally
if (require.main === module) {
    // Run immediately
    fetchAndProduce();

    // Then run every 15 minutes
    const INTERVAL_MS = 15 * 60 * 1000;
    setInterval(() => {
        fetchAndProduce();
    }, INTERVAL_MS);

    console.log(`🔄 Producer scheduled to run every ${INTERVAL_MS / 60000} minutes`);
}
