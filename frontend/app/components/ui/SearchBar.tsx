'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearchChange,
  placeholder = 'Search articles...',
  className,
}: SearchBarProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    onSearchChange(value);
  }, [value, onSearchChange]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-11 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg',
          'text-gray-100 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200'
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
