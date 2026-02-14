import { cn } from '@/lib/utils';
import { CardSize } from '@/types';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]',
        'rounded',
        className
      )}
      style={{
        animation: 'shimmer 2s infinite linear',
      }}
    />
  );
}

interface SkeletonCardProps {
  size: CardSize;
}

export function SkeletonCard({ size }: SkeletonCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-[280px]">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
