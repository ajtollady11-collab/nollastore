import { StarRating } from '@/components/ui/StarRating';
import { hasOnlyPlaceholders, reviewSettings, visibleReviews } from '@/data/reviews';

/**
 * Stars + review link beside the product title (like "★★★★★ 1,300+ reviews").
 * Shows the real count and average once set in data/reviews.ts; while only
 * placeholder reviews exist it says "Sample reviews" and shows no count.
 */
export function ReviewSummary({ className }: { className?: string }) {
  const list = visibleReviews();
  if (list.length === 0) return null;
  const samples = hasOnlyPlaceholders(list);
  const rating = reviewSettings.average ?? 5;
  const label = samples ? 'Sample reviews' : reviewSettings.count ? `${reviewSettings.count} reviews` : `${list.length} review${list.length === 1 ? '' : 's'}`;
  return (
    <a href="#reviews" className={className ?? 'inline-flex items-center gap-2.5 text-[0.88rem] text-charcoal/75 hover:text-charcoal'}>
      <StarRating rating={rating} size={15} className="text-charcoal" />
      <span className="underline decoration-charcoal/25 underline-offset-4">{label}</span>
    </a>
  );
}
