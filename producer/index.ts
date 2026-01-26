import { Kafka, Partitioners } from 'kafkajs';
import Parser from 'rss-parser';
import { config } from './config';

const parser = new Parser();

const kafka = new Kafka({
    clientId: config.kafka.clientId,
    brokers: config.kafka.brokers,
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: config.kafka.username,
        password: config.kafka.password,
    },
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

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
        await producer.connect();
        console.log('✅ Connected to Kafka');

        const messages = [];

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

                    // Use link as key for deduplication (Kafka Compaction or Consumer checks)
                    messages.push({
                        key: article.link,
                        value: JSON.stringify(article),
                    });
                }
            } catch (err) {
                console.error(`❌ Error fetching ${feedConfig.name}:`, err);
            }
        }

        if (messages.length > 0) {
            console.log(`📤 Sending ${messages.length} articles to Kafka topic: ${config.kafka.topic}`);
            await producer.send({
                topic: config.kafka.topic,
                messages,
            });
            console.log('✅ Messages sent successfully');
        } else {
            console.log('⚠️ No articles found to send.');
        }

    } catch (error) {
        console.error('❌ Critical Error:', error);
    } finally {
        await producer.disconnect();
        console.log('👋 Producer disconnected');
    }
};

// If running locally
if (require.main === module) {
    fetchAndProduce();
}
