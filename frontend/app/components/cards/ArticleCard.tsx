import { Article, CardSize } from '@/types';
import { Badge } from '../ui/Badge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getTitleSize, getLineClamp } from './card-variants';
import { cn } from '@/lib/utils';

dayjs.extend(relativeTime);

interface ArticleCardProps {
  article: Article;
  size: CardSize;
}

export function ArticleCard({ article, size }: ArticleCardProps) {
  const titleSize = getTitleSize(size);
  const lineClamp = getLineClamp(size);
  const showSnippet = size !== 'small';

  // Featured cards have a horizontal layout
  const isFeatured = size === 'featured';

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
    >
      <article
        className={cn(
          'bg-gray-800 rounded-xl p-6 border border-gray-700 h-full',
          'transition-all duration-300',
          'hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1',
          isFeatured && 'md:flex md:gap-6 md:items-start'
        )}
      >
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3 gap-2">
            <Badge source={article.source} />
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {dayjs(article.publishedAt || article.pubDate).fromNow()}
            </span>
          </div>

          <h2
            className={cn(
              'font-bold mb-2 leading-tight',
              'group-hover:text-blue-400 transition-colors',
              titleSize
            )}
          >
            {article.title}
          </h2>

          {showSnippet && article.contentSnippet && (
            <p className={cn('text-gray-400 text-sm leading-relaxed', lineClamp)}>
              {article.contentSnippet}
            </p>
          )}
        </div>
      </article>
    </a>
  );
}
