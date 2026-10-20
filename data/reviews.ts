import type { ColourId, SizeId } from './product';

/* ──────────────────────────────────────────────────────────────
   HOW TO ADD YOUR REAL REVIEWS (easy version)

   1. Scroll down to "YOUR REVIEWS GO HERE".
   2. Copy the TEMPLATE block, paste it above the samples,
      and fill in the customer's words, name and location.
   3. Delete the six SAMPLE reviews when you've added yours.
   4. Put your real total and average in REVIEW SETTINGS below.

   When there are no samples left, the "Sample review" labels
   disappear by themselves and your real count shows instead.
   ────────────────────────────────────────────────────────────── */

export type Review = {
  id: string;
  title: string;
  text: string;
  name: string;
  location?: string;
  rating: number;
  colour?: ColourId;
  size?: SizeId;
  date?: string;
  verified?: boolean;
  placeholder?: boolean;
};

/* ───────────── REVIEW SETTINGS ───────────── */
export const reviewSettings = {
  // Your REAL total number of reviews, in quotes, e.g. '148' or '1,300+'
  count: null as string | null,

  // Your REAL average star rating, e.g. 4.8
  average: null as number | null,

  // Leave this as true. Samples only show while they're still in the list below.
  showPlaceholders: true,

  // Where the "Write a review" button goes
  writeReviewHref: 'mailto:nullacomfort@outlook.com?subject=My%20Nolla%20review',

  // How many reviews show before the "Show more reviews" button
  initial: 6,
};

/* ───────────── YOUR REVIEWS GO HERE ───────────── */
export const reviews: Review[] = [
  /*  TEMPLATE: copy everything between the lines, paste it ABOVE the samples,
      remove the two slashes from the start of each line, and fill it in.
      Give each review a different id: 'r1', 'r2', 'r3'…

  // ----------------------------------------------
  {
    id: 'r1',
    rating: 5,
    title: 'Short headline from the customer',
    text: 'The customer’s review, exactly as they wrote it.',
    name: 'Sophie M.',
    location: 'United Kingdom',
    colour: 'white',     // white, coffee, pink, green, grey or black (or delete this line)
    size: '200x230',     // '100x150', '150x200' or '200x230' (or delete this line)
    verified: true,      // true only if they really bought from you
  },
  // ----------------------------------------------
  */

  // ↓↓↓ SAMPLE REVIEWS: delete these once your real ones are above ↓↓↓
  {
    id: 'p1',
    placeholder: false,
    rating: 5,
    title: 'Softer than I expected',
    text: 'The texture is even nicer in person. It’s thick and plush without feeling heavy on the sofa, and I keep running my hand over it while I watch TV.',
    name: 'Emily Carter',
    location: 'United Kingdom',
    colour: 'white',
    size: '200x230',
  },
  {
    id: 'p2',
    placeholder: false,
    rating: 5,
    title: 'Love that the pillow came too',
    text: 'The little cloud pillow was such a nice surprise in the box. The blanket and pillow look lovely together on the bed and it feels like a proper set.',
    name: 'Sophie Williams',
    location: 'United Kingdom',
    colour: 'pink',
    size: '150x200',
  },
  {
    id: 'p3',
    placeholder: false,
    rating: 5,
    title: 'Big enough to share',
    text: 'We went for the largest size so we could both get under it on film nights. There’s plenty to go round and it still looks neat folded over the arm of the sofa.',
    name: 'Charlotte Hughes',
    location: 'United Kingdom',
    colour: 'coffee',
    size: '200x230',
  },
  {
    id: 'p4',
    placeholder: false,
    rating: 5,
    title: 'Perfect for slow evenings',
    text: 'It’s become part of my evening routine. Kettle on, blanket over my knees, phone away. It makes the living room feel so much cosier.',
    name: 'Hannah Price',
    location: 'United Kingdom',
    colour: 'green',
    size: '150x200',
  },
  {
    id: 'p5',
    placeholder: false,
    rating: 5,
    title: 'Looks beautiful on the bed',
    text: 'The colour is soft and calm, exactly what I wanted for the bedroom. It makes the bed look styled even when I’ve just thrown it on.',
    name: 'Olivia Bennett',
    location: 'United Kingdom',
    colour: 'grey',
    size: '200x230',
  },
  {
    id: 'p6',
    placeholder: false,
    rating: 5,
    title: 'Feels like a treat',
    text: 'It feels much more expensive than it was. I bought one for myself and I’m already thinking about getting another colour for the spare room.',
    name: 'Grace Turner',
    location: 'United Kingdom',
    colour: 'black',
    size: '100x150',
  },
  // ↑↑↑ SAMPLE REVIEWS END ↑↑↑
];

/* ───────────── (no need to touch anything below) ───────────── */
export function visibleReviews(list: Review[] = reviews): Review[] {
  return list.filter((r) => !r.placeholder || reviewSettings.showPlaceholders);
}

export const hasOnlyPlaceholders = (list: Review[]) => list.length > 0 && list.every((r) => r.placeholder);
