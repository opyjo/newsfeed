'use client';

import { Article } from '@/types';
import { FilterProvider, useFilters } from './providers/FilterProvider';
import { Header } from './layout/Header';
import { FilterBar } from './filters/FilterBar';
import { BentoGrid } from './grid/BentoGrid';
import { EmptyState } from './ui/EmptyState';

interface NewsfeedClientProps {
  articles: Article[];
}

function NewsfeedContent() {
  const { filteredArticles, debouncedSearchQuery, selectedSources, clearFilters } = useFilters();

  const showNoResults = filteredArticles.length === 0 && debouncedSearchQuery;
  const showNoMatches = filteredArticles.length === 0 && selectedSources.length > 0 && !debouncedSearchQuery;

  return (
    <>
      <Header />
      <FilterBar />

      {filteredArticles.length > 0 ? (
        <BentoGrid articles={filteredArticles} />
      ) : showNoResults ? (
        <EmptyState type="no-results" searchQuery={debouncedSearchQuery} />
      ) : showNoMatches ? (
        <EmptyState type="no-matches" onClearFilters={clearFilters} />
      ) : (
        <EmptyState type="no-data" />
      )}
    </>
  );
}

export function NewsfeedClient({ articles }: NewsfeedClientProps) {
  return (
    <FilterProvider articles={articles}>
      <NewsfeedContent />
    </FilterProvider>
  );
}
