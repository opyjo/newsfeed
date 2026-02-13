import { FileQuestion, Search, Filter } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-data' | 'no-results' | 'no-matches';
  searchQuery?: string;
  onClearFilters?: () => void;
}

export function EmptyState({ type, searchQuery, onClearFilters }: EmptyStateProps) {
  const content = {
    'no-data': {
      icon: FileQuestion,
      title: 'No articles yet',
      description: 'The consumer is syncing articles from RSS feeds. Check back in a moment!',
    },
    'no-results': {
      icon: Search,
      title: 'No results found',
      description: searchQuery
        ? `No articles match "${searchQuery}"`
        : 'Try a different search term',
    },
    'no-matches': {
      icon: Filter,
      title: 'No articles match your filters',
      description: 'Try selecting different sources or clearing all filters',
    },
  };

  const { icon: Icon, title, description } = content[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-gray-800 rounded-full p-6 mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>
      {type === 'no-matches' && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
