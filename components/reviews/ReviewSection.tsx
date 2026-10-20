'use client';

import { useState } from 'react';
import { BadgeCheck, PenLine } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { hasOnlyPlaceholders, reviewSettings, visibleReviews, type Review } from '@/data/reviews';
import { getColour, getSize } from '@/data/product';

/**
 * "What people are saying": summary row, a grid of review cards,
 * "Show more" and "Write a review". Placeholder reviews are clearly labelled.
 */
export function ReviewSection({ reviews }: { reviews?: Review[] }) {
  const list = visibleReviews(reviews);
  const [shown, setShown] = useState(reviewSettings.initial);
  if (list.length === 0) return null;

  const samples = hasOnlyPlaceholders(list);
  const average = reviewSettings.average ?? list.reduce((s, r) => s + r.rating, 0) / list.length;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-20 border-t border-charcoal/10 py-20 sm:py-28">
      <div className="container-soft">
        <Reveal>
          <p className="eyebrow">Reviews</p>
          <h2 id="reviews-title" className="headline mt-4">
            What people are saying
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-5 border-y border-charcoal/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <StarRating rating={average} size={18} className="text-charcoal" />
            <p className="text-[0.95rem] text-charcoal/70">
              {samples
                ? 'Sample reviews: our first customer reviews will appear here soon.'
                : `Based on ${reviewSettings.count ?? list.length} customer review${list.length === 1 && !reviewSettings.count ? '' : 's'}`}
            </p>
          </div>
          <Button href={reviewSettings.writeReviewHref} variant="secondary" size="md" className="self-start sm:self-auto">
            <PenLine className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            Write a review
          </Button>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {list.slice(0, shown).map((r, i) => {
            const variant = [getColour(r.colour ?? '')?.label, getSize(r.size ?? '')?.label].filter(Boolean).join(' · ');
            return (
              <Reveal as="li" key={r.id} delay={(i % 3) * 70} className="flex flex-col rounded-soft bg-oat-soft p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <StarRating rating={r.rating} size={14} className="text-charcoal" />
                  {r.placeholder && <span className="text-[0.68rem] uppercase tracking-[0.12em] text-charcoal/45">Sample review</span>}
                </div>
                <h3 className="mt-4 text-[1.05rem] font-medium leading-snug text-charcoal">{r.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-charcoal/65">{r.text}</p>
                <div className="mt-6 text-[0.88rem]">
                  <p className="font-medium text-charcoal">{r.name}</p>
                  {r.location && <p className="mt-0.5 text-charcoal/50">{r.location}</p>}
                  {variant && <p className="mt-0.5 text-charcoal/50">{variant}</p>}
                  {r.verified && (
                    <p className="mt-2 inline-flex items-center gap-1 text-mocha">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified purchase
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>

        {shown < list.length && (
          <div className="mt-10 flex justify-center">
            <Button variant="secondary" size="lg" onClick={() => setShown((n) => n + 6)}>
              Show more reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
