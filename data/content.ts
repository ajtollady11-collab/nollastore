import { photoFor, GIFT, type ImageAsset } from './product';

/**
 * ─────────────────────────────────────────────────────────────
 *  PAGE COPY
 *  Wording for each homepage section. Every claim here is backed by the
 *  product information we have (material, sizes, colours, the free pillow).
 *  Nothing about temperature, health, washing or performance until confirmed.
 * ─────────────────────────────────────────────────────────────
 */

export const hero = {
  eyebrow: 'The Nuv™ Velvet Blanket',
  title: 'Make staying in feel better.',
  body: 'Deep, rippled faux fur you’ll want to sink into. For slow mornings, film nights and every quiet evening in between.',
  cta: 'Meet your new favourite blanket',
  image: {
    src: '/images/home/hero-nuv-faux-fur-2k.webp',
    alt: 'A woman wrapped in the white Nolla Nuv blanket, eyes closed and smiling, in an armchair by a sunny window.',
  } satisfies ImageAsset,
};

/** Product detail panels in the purchase section */
export const productDetails: { id: string; title: string; body: string }[] = [
  {
    id: 'fabric',
    title: 'The fabric',
    body: 'Rex rabbit velvet: a dense faux fur (no real fur) with a deep, rippled surface that’s soft to the touch and full of texture. Colours can look slightly different from screen to screen.',
  },
  {
    id: 'included',
    title: 'What’s included',
    body: 'One Nuv™ Velvet Blanket in the colour and size you choose, and one Nimbus™ cloud pillow (25 cm) for every blanket, free.',
  },
  {
    // PLACEHOLDER: replace with the supplier's confirmed care instructions before launch
    id: 'care',
    title: 'Care',
    body: 'We’re confirming full care instructions with our maker. Until then, please follow the care label sewn into your blanket.',
  },
];

export const giftSection = {
  eyebrow: 'Included with every blanket',
  title: 'A little cloud, on us.',
  body: 'Every Nuv™ blanket comes with a Nimbus™ cloud pillow, because comfort is better with a little extra.',
  points: ['One pillow with each blanket', 'No extra charge', 'No code needed: it’s added to your bag automatically'],
  image: GIFT.image,
};

/** Editorial "staying in" moments. Photos chosen so each moment shows a different colour. */
export const moments: { title: string; body: string; image: ImageAsset }[] = [
  { title: 'Slow mornings', body: 'Coffee, a window seat and nowhere to be.', image: photoFor('white', 'wrapped') },
  { title: 'Film nights', body: 'Room for everyone on the sofa.', image: photoFor('coffee', 'family') },
  { title: 'Early nights', body: 'A bed you look forward to.', image: photoFor('green', 'bed') },
];

export const benefits = {
  eyebrow: 'Why it belongs at home',
  title: 'Made to be used every day, not saved for best.',
  items: [
    { title: 'A surface you keep touching', body: 'Deep, rippled faux fur with real texture. Soft enough that your hand finds it without thinking.' },
    { title: 'Sized generously', body: 'From a 100 × 150 cm throw to a 200 × 230 cm blanket big enough to share.' },
    { title: 'Sofa, bed, armchair', body: 'Over your knees, across the bed, around your shoulders. It moves with you.' },
    { title: 'Six calm colours', body: 'White, Coffee, Pink, Green, Grey and Black, chosen to sit softly in a lived-in home.' },
  ],
  image: photoFor('pink', 'draped'),
};

export const fabric = {
  eyebrow: 'Up close',
  title: 'Made for the moments you slow down.',
  body: 'Rows of deep, rippled faux fur that catch the light and give under your hand. Choose a colour to see its texture.',
};

export const story = {
  eyebrow: 'Our story',
  title: 'Home should be the best part of the day.',
  paragraphs: [
    'Most of life happens at home: the slow mornings, the late films, the evenings you finally get to yourself.',
    'Nolla exists to make those hours something to look forward to, with things that are soft, generous and made to be lived in. We started with one blanket, and we made it the best we could.',
  ],
  signoff: 'Make staying in feel better.',
  image: photoFor('white', 'snuggled'),
};

export const finalCta = {
  title: 'Make staying in the best part of your day.',
  body: 'One blanket. One little cloud. A more comfortable evening.',
  cta: 'Choose your blanket',
  image: {
    src: '/images/home/hero-nuv-wrapped.webp',
    alt: 'Someone wrapped up in the white Nuv blanket in a sunny armchair.',
  } satisfies ImageAsset,
};
