'use client';

import { Article } from '@/types';
import { ArticleCard } from '../cards/ArticleCard';
import { getSizeVariant, getColSpanClasses } from '../cards/card-variants';
import { GridItem } from './GridItem';
import { SkeletonCard } from '../ui/Skeleton';

interface BentoGridProps {
  articles: Article[];
  isLoading?: boolean;
}

export function BentoGrid({ articles, isLoading = false }: BentoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => {
          const size = getSizeVariant(i);
          const colSpan = getColSpanClasses(size);
          return (
            <div key={i} className={colSpan}>
              <SkeletonCard size={size} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
      {articles.map((article, index) => {
        const size = getSizeVariant(index);
        const colSpan = getColSpanClasses(size);

        return (
          <GridItem key={article.id} index={index} colSpan={colSpan}>
            <ArticleCard article={article} size={size} />
          </GridItem>
        );
      })}
    </div>
  );
}
