'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface GridItemProps {
  children: ReactNode;
  index: number;
  colSpan: string;
}

export function GridItem({ children, index, colSpan }: GridItemProps) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={cn(
        colSpan,
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{
        transitionDelay: `${Math.min(index * 50, 500)}ms`,
      }}
    >
      {children}
    </div>
  );
}
