import dotenv from 'dotenv';

dotenv.config();

export const config = {
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || '').split(','),
    username: process.env.KAFKA_USERNAME || '',
    password: process.env.KAFKA_PASSWORD || '',
    clientId: 'ai-news-producer',
    topic: process.env.KAFKA_TOPIC_RAW || 'raw-articles',
  },
  feeds: [
    {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/rss.xml',
    },
    {
      name: 'Google AI Blog',
      url: 'http://googleaiblog.blogspot.com/atom.xml',
    },
    {
      name: 'MIT Technology Review - AI',
      url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    },
    {
      name: 'Papers With Code',
      url: 'https://paperswithcode.com/latest/rss',
    },
  ],
};
