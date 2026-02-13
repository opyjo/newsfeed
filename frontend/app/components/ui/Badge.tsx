import { getCategoryForSource } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BadgeProps {
  source: string;
  className?: string;
}

export function Badge({ source, className }: BadgeProps) {
  const category = getCategoryForSource(source);
  const colors = CATEGORY_COLORS[category];

  return (
    <span
      className={cn(
        'text-xs font-semibold px-2 py-1 rounded border',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {source}
    </span>
  );
}
