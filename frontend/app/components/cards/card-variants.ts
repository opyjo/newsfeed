import { CardSize } from '@/types';

// Determine card size based on index in grid
// Pattern repeats every 7 cards: Featured, Large, Small, Small, Medium, Medium, Small
export function getSizeVariant(index: number): CardSize {
  const pattern = index % 7;

  switch (pattern) {
    case 0:
      return 'featured'; // Full width
    case 1:
      return 'large'; // 2/3 width
    case 2:
    case 3:
    case 6:
      return 'small'; // 1/3 width
    case 4:
    case 5:
      return 'medium'; // 1/2 width
    default:
      return 'medium';
  }
}

// Get responsive column span classes for each card size
export function getColSpanClasses(size: CardSize): string {
  const spans = {
    featured: 'col-span-1 md:col-span-6 lg:col-span-12',
    large: 'col-span-1 md:col-span-4 lg:col-span-8',
    medium: 'col-span-1 md:col-span-3 lg:col-span-6',
    small: 'col-span-1 md:col-span-2 lg:col-span-4',
  };

  return spans[size];
}

// Get line clamp based on card size
export function getLineClamp(size: CardSize): string {
  const clamps = {
    small: '',  // No snippet for small cards
    medium: 'line-clamp-2',
    large: 'line-clamp-3',
    featured: 'line-clamp-4',
  };

  return clamps[size];
}

// Get title size based on card size
export function getTitleSize(size: CardSize): string {
  const sizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    featured: 'text-2xl md:text-3xl',
  };

  return sizes[size];
}
