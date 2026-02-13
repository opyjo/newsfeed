import { clsx, type ClassValue } from 'clsx';
import { SOURCE_CATEGORIES } from './constants';
import { SourceCategory } from '@/types';

// Merge className strings
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Get category for a source
export function getCategoryForSource(source: string): SourceCategory {
  return SOURCE_CATEGORIES[source] || 'tech';
}

// Truncate text to max length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Format relative time (used as fallback if dayjs fails)
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
  } catch {
    return 'unknown';
  }
}
