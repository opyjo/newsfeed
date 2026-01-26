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
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    },
    {
      name: 'VentureBeat AI',
      url: 'https://venturebeat.com/category/ai/feed/',
    },
    {
      name: 'The Verge AI',
      url: 'https://www.theverge.com/rss/artificial-intelligence/index.xml',
    },
    {
      name: 'Hugging Face Blog',
      url: 'https://huggingface.co/blog/feed.xml',
    },
    {
      name: 'Microsoft AI Blog',
      url: 'https://blogs.microsoft.com/ai/feed/',
    },
    {
      name: 'Amazon Science (AI)',
      url: 'https://www.amazon.science/index.rss',
    },
    {
      name: 'NVIDIA Blog',
      url: 'https://blogs.nvidia.com/feed/',
    },
  ],
};
