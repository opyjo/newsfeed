'use client';

import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { Article } from '@/types';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface FilterContextValue {
  searchQuery: string;
  debouncedSearchQuery: string;
  selectedSources: string[];
  filteredArticles: Article[];
  toggleSource: (source: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  allSources: string[];
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  articles: Article[];
}

export function FilterProvider({ children, articles }: FilterProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Extract all unique sources from articles
  const allSources = useMemo(() => {
    const sources = new Set(articles.map(a => a.source));
    return Array.from(sources).sort();
  }, [articles]);

  const toggleSource = useCallback((source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSources([]);
    setSearchQuery('');
  }, []);

  // Filter articles based on search and source filters
  const filteredArticles = useMemo(() => {
    let result = articles;

    // Apply source filter
    if (selectedSources.length > 0) {
      result = result.filter(article =>
        selectedSources.includes(article.source)
      );
    }

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.contentSnippet?.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    }

    return result;
  }, [articles, selectedSources, debouncedSearchQuery]);

  const activeFilterCount = selectedSources.length + (debouncedSearchQuery ? 1 : 0);

  const value = {
    searchQuery,
    debouncedSearchQuery,
    selectedSources,
    filteredArticles,
    toggleSource,
    setSearchQuery,
    clearFilters,
    activeFilterCount,
    allSources,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
