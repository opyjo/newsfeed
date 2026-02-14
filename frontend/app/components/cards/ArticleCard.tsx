import { Article, CardSize } from '@/types';
import { Badge } from '../ui/Badge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@/lib/utils';

dayjs.extend(relativeTime);

interface ArticleCardProps {
  article: Article;
  size: CardSize;
}

export function ArticleCard({ article, size }: ArticleCardProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
    >
      <article
        className={cn(
          'bg-gray-800 rounded-xl p-5 border border-gray-700',
          'h-[280px] flex flex-col',
          'transition-all duration-300',
          'hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1'
        )}
      >
        <div className="flex justify-between items-start mb-3 gap-2">
          <Badge source={article.source} />
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {dayjs(article.publishedAt || article.pubDate).fromNow()}
          </span>
        </div>

        <h2
          className={cn(
            'text-base font-bold mb-2 leading-tight',
            'group-hover:text-blue-400 transition-colors',
            'line-clamp-3'
          )}
        >
          {article.title}
        </h2>

        {article.contentSnippet && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 flex-1">
            {article.contentSnippet}
          </p>
        )}
      </article>
    </a>
  );
}
