'use client';

import { SearchBar } from '../ui/SearchBar';
import { useFilters } from '../providers/FilterProvider';

export function Header() {
  const { setSearchQuery, filteredArticles } = useFilters();

  return (
    <header className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-4 tracking-tight">
          Tech News Feed
        </h1>
        <p className="text-gray-400 text-lg">
          Curated updates from 29 top tech sources
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <SearchBar onSearchChange={setSearchQuery} placeholder="Search articles by title, content, or source..." />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
        </p>
      </div>
    </header>
  );
}
