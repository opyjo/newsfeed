import { SourceCategory } from '@/types';

// Map sources to categories for color-coding
export const SOURCE_CATEGORIES: Record<string, SourceCategory> = {
  // AI Sources
  'OpenAI Blog': 'ai',
  'Google AI Blog': 'ai',
  'MIT Technology Review - AI': 'ai',
  'Papers With Code': 'ai',
  'TechCrunch AI': 'ai',
  'VentureBeat AI': 'ai',
  'The Verge AI': 'ai',
  'Hugging Face Blog': 'ai',
  'Microsoft AI Blog': 'ai',
  'Amazon Science (AI)': 'ai',
  'NVIDIA Blog': 'ai',

  // General Tech
  'Hacker News': 'tech',
  'Ars Technica': 'tech',
  'Wired': 'tech',
  'The Register': 'tech',
  'TechCrunch': 'tech',
  'The Verge': 'tech',
  'Slashdot': 'tech',
  'IEEE Spectrum': 'tech',
  'TechCrunch Startups': 'tech',
  'The Verge Tech': 'tech',
  'IEEE Spectrum Computing': 'tech',

  // Gadgets & Consumer Tech
  'Engadget': 'gadgets',
  'CNET': 'gadgets',
  'TechRadar': 'gadgets',
  'ZDNet': 'gadgets',
  'Ars Technica Gadgets': 'gadgets',

  // Security
  'Ars Technica Security': 'security',

  // Space
  'Ars Technica Space': 'space',
};

// Color schemes for each category
export const CATEGORY_COLORS = {
  ai: {
    bg: 'bg-blue-900/50',
    text: 'text-blue-300',
    border: 'border-blue-800',
    hover: 'hover:bg-blue-900/70',
  },
  tech: {
    bg: 'bg-purple-900/50',
    text: 'text-purple-300',
    border: 'border-purple-800',
    hover: 'hover:bg-purple-900/70',
  },
  gadgets: {
    bg: 'bg-emerald-900/50',
    text: 'text-emerald-300',
    border: 'border-emerald-800',
    hover: 'hover:bg-emerald-900/70',
  },
  security: {
    bg: 'bg-red-900/50',
    text: 'text-red-300',
    border: 'border-red-800',
    hover: 'hover:bg-red-900/70',
  },
  space: {
    bg: 'bg-indigo-900/50',
    text: 'text-indigo-300',
    border: 'border-indigo-800',
    hover: 'hover:bg-indigo-900/70',
  },
};

// All sources for filter dropdown
export const ALL_SOURCES = Object.keys(SOURCE_CATEGORIES);
