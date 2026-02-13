'use client';

import { X } from 'lucide-react';
import { SourceFilter } from './SourceFilter';
import { useFilters } from '../providers/FilterProvider';
import { cn } from '@/lib/utils';

export function FilterBar() {
  const { activeFilterCount, clearFilters } = useFilters();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Filter by Source</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              'bg-gray-800 hover:bg-gray-750 text-gray-300',
              'border border-gray-700 hover:border-gray-600',
              'transition-all duration-200 text-sm font-medium'
            )}
          >
            <X className="w-4 h-4" />
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>
      <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <SourceFilter />
      </div>
    </div>
  );
}
