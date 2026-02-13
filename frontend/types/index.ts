export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  publishedAt?: string;
  contentSnippet?: string;
  source: string;
  fetchedAt: string;
}

export type CardSize = 'small' | 'medium' | 'large' | 'featured';

export type SourceCategory = 'ai' | 'tech' | 'gadgets' | 'security' | 'space';

export interface FilterState {
  searchQuery: string;
  selectedSources: string[];
}
