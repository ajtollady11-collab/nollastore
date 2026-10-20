/**
 * ─────────────────────────────────────────────────────────────
 *  CUSTOMER REVIEWS: genuine reviews only.
 *  While this list is empty the reviews section doesn't render at all,
 *  and no star ratings or review counts appear anywhere on the site.
 *
 *  Add a review like this (copy wording exactly as the customer wrote it):
 *    {
 *      id: 'r1',
 *      name: 'Sophie M.',            // as the customer agreed to be shown
 *      location: 'Manchester, UK',   // optional
 *      rating: 5,                    // 1–5, from the review platform
 *      text: '…',
 *      colour: 'white',              // optional, which blanket they bought
 *      size: '200x230',              // optional
 *      date: '2026-11-02',           // optional, ISO date
 *      verified: true,               // true only for confirmed purchases
 *    },
 *
 *  Using a review app later (Judge.me, Okendo, Trustpilot…)? Fetch its reviews
 *  into this same `Review[]` shape and pass them to <ReviewSection reviews={…} />.
 * ─────────────────────────────────────────────────────────────
 */
import type { ColourId, SizeId } from './product';

export type Review = {
  id: string;
  name: string;
  location?: string;
  rating: number;
  text: string;
  colour?: ColourId;
  size?: SizeId;
  date?: string;
  verified?: boolean;
};

export const reviews: Review[] = [];
