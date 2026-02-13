'use client';

import { cn, getCategoryForSource } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';
import { useFilters } from '../providers/FilterProvider';

export function SourceFilter() {
  const { allSources, selectedSources, toggleSource } = useFilters();

  return (
    <div className="flex flex-wrap gap-2">
      {allSources.map(source => {
        const isSelected = selectedSources.includes(source);
        const category = getCategoryForSource(source);
        const colors = CATEGORY_COLORS[category];

        return (
          <button
            key={source}
            onClick={() => toggleSource(source)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200',
              'hover:scale-105',
              isSelected
                ? cn(colors.bg, colors.text, colors.border, 'shadow-sm')
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
            )}
            aria-label={`Filter by ${source}`}
            aria-pressed={isSelected}
          >
            {source}
          </button>
        );
      })}
    </div>
  );
}
