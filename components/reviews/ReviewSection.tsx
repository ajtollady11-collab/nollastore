import { BadgeCheck } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { Reveal } from '@/components/ui/Reveal';
import { reviews as savedReviews, type Review } from '@/data/reviews';
import { COLOURS, SIZES } from '@/data/product';

/**
 * Customer reviews. Renders nothing until genuine reviews exist in data/reviews.ts
 * (or are passed in from a review platform), so the page never shows invented proof.
 */
export function ReviewSection({ reviews = savedReviews, limit = 6 }: { reviews?: Review[]; limit?: number }) {
  const list = reviews.slice(0, limit);
  if (list.length === 0) return null;

  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-20 border-t border-charcoal/10 py-20 sm:py-28">
      <div className="container-soft">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 id="reviews-title" className="headline mt-4">
              In their words.
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[0.9rem] text-charcoal/65">
            <StarRating rating={average} />
            <span>
              {average.toFixed(1)} from {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </span>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <Reveal as="li" key={r.id} delay={(i % 3) * 80} className="border-t border-charcoal/15 pt-6">
              <figure>
                <StarRating rating={r.rating} size={13} />
                <blockquote className="mt-4 font-serif text-[1.3rem] font-light leading-[1.4] tracking-[-0.01em] text-charcoal">“{r.text}”</blockquote>
                <figcaption className="mt-5 text-[0.85rem] text-charcoal/60">
                  <span className="font-medium text-charcoal">{r.name}</span>
                  {r.location && <span>, {r.location}</span>}
                  {(r.colour || r.size) && (
                    <span className="mt-1 block text-charcoal/50">
                      {[COLOURS.find((c) => c.id === r.colour)?.label, SIZES.find((s) => s.id === r.size)?.label].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  {r.verified && (
                    <span className="mt-2 inline-flex items-center gap-1 text-mocha">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified purchase
                    </span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
