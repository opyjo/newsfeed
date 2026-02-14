'use client';

import { Article } from '@/types';
import { ArticleCard } from '../cards/ArticleCard';
import { GridItem } from './GridItem';
import { SkeletonCard } from '../ui/Skeleton';

interface BentoGridProps {
  articles: Article[];
  isLoading?: boolean;
}

export function BentoGrid({ articles, isLoading = false }: BentoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <SkeletonCard size="medium" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {articles.map((article, index) => (
        <GridItem key={article.id} index={index} colSpan="">
          <ArticleCard article={article} size="medium" />
        </GridItem>
      ))}
    </div>
  );
}
