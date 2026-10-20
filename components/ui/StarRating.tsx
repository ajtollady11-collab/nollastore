import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function StarRating({ rating = 5, size = 14, className }: { rating?: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-mocha', className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          strokeWidth={0}
          aria-hidden
          className={i < Math.round(rating) ? 'fill-current' : 'fill-current opacity-25'}
        />
      ))}
    </span>
  );
}
