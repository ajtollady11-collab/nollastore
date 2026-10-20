/**
 * ─────────────────────────────────────────────────────────────
 *  REVIEWS
 *
 *  Right now the section shows PLACEHOLDER reviews (marked `placeholder: false`)
 *  so you can see the layout. While any placeholder is showing, the site labels
 *  them "Sample reviews" and doesn't show a review count.
 *
 *  Before launch, replace them with genuine customer reviews (or set
 *  `reviewSettings.showPlaceholders` to false to hide the section until you have some).
 *  UK law (DMCC Act 2024) bans publishing fake or invented reviews as real ones.
 *
 *  Real review, copied exactly as the customer wrote it:
 *    { id: 'r1', title: '…', text: '…', name: 'Sophie M.', location: 'Manchester, UK',
 *      rating: 5, colour: 'white', size: '200x230', verified: true },
 *
 *  Using a review app later (Judge.me, Okendo, Trustpilot…)? Fetch its reviews into
 *  this same shape and set `reviewSettings.count` to the real total.
 * ─────────────────────────────────────────────────────────────
 */
import type { ColourId, SizeId } from './product';

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
  /** Layout preview only. Labelled "Sample review" on the site. */
  placeholder?: boolean;
};

export const reviewSettings = {
  /** Show the placeholder reviews below (labelled as samples) */
  showPlaceholders: true,
  /** Real total review count, e.g. '1,300+'. Leave null until you have real reviews. */
  count: null as string | null,
  /** Real average rating (1–5). Leave null until you have real reviews. */
  average: null as number | null,
  /** Where "Write a review" goes until a review app is connected */
  writeReviewHref: 'mailto:nullacomfort@outlook.com?subject=My%20Nolla%20review',
  /** How many to show before "Show more" */
  initial: 6,
};

export const reviews: Review[] = [
  {
    id: 'p1',
    placeholder: true,
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
    placeholder: true,
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
    placeholder: true,
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
    placeholder: true,
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
    placeholder: true,
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
    placeholder: true,
    rating: 5,
    title: 'Feels like a treat',
    text: 'It feels much more expensive than it was. I bought one for myself and I’m already thinking about getting another colour for the spare room.',
    name: 'Grace Turner',
    location: 'United Kingdom',
    colour: 'black',
    size: '100x150',
  },
];

/** Reviews to show: genuine ones always; placeholders only while switched on */
export function visibleReviews(list: Review[] = reviews): Review[] {
  return list.filter((r) => !r.placeholder || reviewSettings.showPlaceholders);
}

export const hasOnlyPlaceholders = (list: Review[]) => list.length > 0 && list.every((r) => r.placeholder);
