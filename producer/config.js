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
        sqsQueueUrl: process.env.SQS_QUEUE_URL || '',
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
        // General Tech News
        {
            name: 'Hacker News',
            url: 'https://news.ycombinator.com/rss',
        },
        {
            name: 'Ars Technica',
            url: 'https://arstechnica.com/feed/',
        },
        {
            name: 'Wired',
            url: 'https://www.wired.com/feed/rss',
        },
        {
            name: 'The Register',
            url: 'https://www.theregister.com/headlines.atom',
        },
        {
            name: 'TechCrunch',
            url: 'https://techcrunch.com/feed/',
        },
        {
            name: 'The Verge',
            url: 'https://www.theverge.com/rss/index.xml',
        },
        {
            name: 'Slashdot',
            url: 'http://rss.slashdot.org/Slashdot/slashdotMain',
        },
        {
            name: 'IEEE Spectrum',
            url: 'https://spectrum.ieee.org/feeds/feed.rss',
        },
        // Consumer Tech & Gadgets
        {
            name: 'Engadget',
            url: 'https://www.engadget.com/rss.xml',
        },
        {
            name: 'CNET',
            url: 'https://www.cnet.com/rss/news/',
        },
        {
            name: 'TechRadar',
            url: 'https://www.techradar.com/rss',
        },
        {
            name: 'ZDNet',
            url: 'https://www.zdnet.com/news/rss.xml',
        },
        // Specialized Tech
        {
            name: 'Ars Technica Security',
            url: 'https://arstechnica.com/security/feed/',
        },
        {
            name: 'Ars Technica Gadgets',
            url: 'https://arstechnica.com/gadgets/feed/',
        },
        {
            name: 'Ars Technica Space',
            url: 'https://arstechnica.com/space/feed/',
        },
        {
            name: 'TechCrunch Startups',
            url: 'https://techcrunch.com/category/startups/feed/',
        },
        {
            name: 'The Verge Tech',
            url: 'https://www.theverge.com/tech/rss/index.xml',
        },
        {
            name: 'IEEE Spectrum Computing',
            url: 'https://spectrum.ieee.org/feeds/computing.rss',
        },
    ],
};
