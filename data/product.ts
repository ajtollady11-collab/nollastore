import { FALLBACK_RATES, REGIONS, type RegionId } from './regions';

/**
 * ─────────────────────────────────────────────────────────────
 *  THE PRODUCT
 *  Nolla sells one product: the Nuv™ Velvet Blanket, in 6 colours × 3 sizes.
 *  Every price, colour, size, photo and offer on the site comes from this file.
 *
 *  Prices are integers in the smallest unit (pence / cents), the same
 *  convention Square uses, so there is never any float rounding.
 *
 *  Supplier: CJdropshipping "Rex Rabbit Velvet Blanket" (CJZW217296206FU).
 *  Gift:     CJdropshipping "Plush cloud pillow" (CJJJJFZT00537-White-25cm).
 * ─────────────────────────────────────────────────────────────
 */

export type ImageAsset = { src: string; alt: string };

export const PRODUCT = {
  /** Stable id sent to the server with every cart line */
  slug: 'nolla-nuv',
  name: 'Nolla Nuv™ Velvet Blanket',
  shortName: 'Nuv™ Velvet Blanket',
  /** What it is, in plain words (supplier description: faux rex rabbit velvet, no real fur) */
  material: 'Rex rabbit faux-fur velvet',
  tagline: 'The blanket you’ll keep reaching for.',
  description:
    'Deep, rippled faux fur that sinks under your hand. Pull it over your knees for a slow morning, share it on the sofa for a film, or leave it across the bed so it’s there when you need it.',
  /** Square catalogue item id, once the catalogue is set up */
  externalId: undefined as string | undefined,
} as const;

/* ───────────────────────────── COLOURS ─────────────────────────────
 * `photos` points at the existing colourway photography in /public/images/nuv.
 * Each set was shot from the matching supplier colour:
 *   White → tosca-white, Grey → grey, Black → charcoal (supplier "Black";
 *   it photographs as a deep charcoal), Coffee → coffee, Green → sage, Pink → pink.
 * Confirm Black against a physical sample before launch.
 */

export type ColourId =
  | 'white'
  | 'coffee'
  | 'pink'
  | 'green'
  | 'grey'
  | 'black'
  // Custom collection
  | 'pastel-rainbow'
  | 'navy-tie-dye'
  | 'grey-tie-dye'
  | 'sky-tie-dye'
  | 'caramel-swirl'
  | 'mocha-swirl'
  | 'charcoal-frost'
  | 'vanilla-swirl';

/**
 * Two collections: the six classic colours, and the custom collection
 * (patterned blankets with their own sizes and prices). Each collection
 * has its own three sizes in SIZES.
 */
export type Collection = 'classic' | 'custom';

export type Colour = {
  id: ColourId;
  /** Customer-facing name */
  label: string;
  /** Name in the supplier catalogue, sent with the order so fulfilment is unambiguous */
  supplierName: string;
  collection: Collection;
  /** Swatch: any CSS background (a colour, or a gradient for patterned blankets) */
  swatch: string;
  /** File prefix: /public/images/nuv (classic) or /public/images/nuv-custom (custom) */
  photos: string;
  /** Square variation id (per colour/size), once the catalogue is set up */
  externalId?: string;
  available?: boolean;
};

export const COLOURS: Colour[] = [
  {
    id: 'white',
    label: 'White',
    supplierName: 'White',
    collection: 'classic',
    swatch: '#EEE8DE',
    photos: 'tosca-white',
  },
  {
    id: 'coffee',
    label: 'Coffee',
    supplierName: 'Coffee',
    collection: 'classic',
    swatch: '#CDB394',
    photos: 'coffee',
  },
  {
    id: 'pink',
    label: 'Pink',
    supplierName: 'Powder Pink',
    collection: 'classic',
    swatch: '#DDB4B0',
    photos: 'pink',
  },
  {
    id: 'green',
    label: 'Green',
    supplierName: 'Green',
    collection: 'classic',
    swatch: '#C3CCAD',
    photos: 'sage',
  },
  {
    id: 'grey',
    label: 'Grey',
    supplierName: 'Gray',
    collection: 'classic',
    swatch: '#AAA8A3',
    photos: 'grey',
  },
  {
    id: 'black',
    label: 'Black',
    supplierName: 'Black',
    collection: 'classic',
    swatch: '#2F2E2E',
    photos: 'charcoal',
  },

  // ── Custom collection ── (names are working names: change `label` freely;
  // set `supplierName` to the supplier's own name for each so orders are easy to fulfil)
  {
    id: 'pastel-rainbow',
    label: 'Pastel Rainbow',
    supplierName: 'Pastel Rainbow',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #F6B5CF 0%, #F8E2A8 35%, #BFE6D6 65%, #B8CBF2 100%)',
    photos: 'pastel-rainbow',
  },
  {
    id: 'navy-tie-dye',
    label: 'Navy Tie-Dye',
    supplierName: 'Navy Tie-Dye',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #2B3A5C 0%, #2B3A5C 42%, #E1E5EC 58%, #E1E5EC 100%)',
    photos: 'navy-tie-dye',
  },
  {
    id: 'grey-tie-dye',
    label: 'Grey Tie-Dye',
    supplierName: 'Grey Tie-Dye',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #6F6D6C 0%, #6F6D6C 42%, #ECE9E4 58%, #ECE9E4 100%)',
    photos: 'grey-tie-dye',
  },
  {
    id: 'sky-tie-dye',
    label: 'Sky Tie-Dye',
    supplierName: 'Sky Tie-Dye',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #93AECB 0%, #93AECB 42%, #F0F3F7 58%, #F0F3F7 100%)',
    photos: 'sky-tie-dye',
  },
  {
    id: 'caramel-swirl',
    label: 'Caramel Swirl',
    supplierName: 'Caramel Swirl',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #C59A62 0%, #C59A62 42%, #F5ECDF 58%, #F5ECDF 100%)',
    photos: 'caramel-swirl',
  },
  {
    id: 'mocha-swirl',
    label: 'Mocha Swirl',
    supplierName: 'Mocha Swirl',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #8A7969 0%, #8A7969 42%, #EEE7DE 58%, #EEE7DE 100%)',
    photos: 'mocha-swirl',
  },
  {
    id: 'charcoal-frost',
    label: 'Charcoal Frost',
    supplierName: 'Charcoal Frost',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #2E2E30 0%, #2E2E30 42%, #E7E5E1 58%, #E7E5E1 100%)',
    photos: 'charcoal-frost',
  },
  {
    id: 'vanilla-swirl',
    label: 'Vanilla Swirl',
    supplierName: 'Vanilla Swirl',
    collection: 'custom',
    swatch: 'linear-gradient(135deg, #E8D29E 0%, #E8D29E 42%, #FBF6EA 58%, #FBF6EA 100%)',
    photos: 'vanilla-swirl',
  },
];

export const CLASSIC_COLOURS = COLOURS.filter((c) => c.collection === 'classic');
export const CUSTOM_COLOURS = COLOURS.filter((c) => c.collection === 'custom');

/* ───────────────────────────── SIZES & PRICES ─────────────────────────────
 * `prices` are our own price lists, in pence / cents. The US prices are deliberate
 * retail prices, NOT conversions: never calculate one from the other.
 * Every other currency on the site is converted from the GBP price for display.
 *
 * `referencePrices` are the struck-through comparison prices shown next to the
 * selling price while PROMOTION.enabled is true. Leave a region `null` to show no
 * comparison there. UK pricing rules (CMA / DMCC Act) require a "was"-style price
 * to be a genuine price the product was sold at for a meaningful period, so only
 * fill these in once that's true, and keep PROMOTION.referenceLabel accurate.
 */

export type SizeId =
  | '100x150'
  | '150x200'
  | '200x230'
  // Custom collection
  | 'custom-100x160'
  | 'custom-160x200'
  | 'custom-200x230';

export type SizeTier = 'M' | 'L' | 'XL';

export type Size = {
  id: SizeId;
  collection: Collection;
  /** Medium / Large / Extra Large: the same tier in both collections */
  tier: SizeTier;
  name: string;
  /** Measurements, e.g. "100 × 150 cm" */
  label: string;
  widthCm: number;
  lengthCm: number;
  prices: { GBP: number; USD: number };
  /** Converted currencies follow the GBP reference price */
  referencePrices: { GBP: number | null; USD: number | null };
  /**
   * What checkout charges (in GBP, pence) for orders DELIVERED TO THE US.
   * This is the US $ price converted to £ (at about $1.34 to £1).
   * Update these if the exchange rate moves a lot.
   */
  usChargeGBP: number;
  /** Small label on the size option */
  badge?: string;
  /** Plain-language guidance for the size guide (no bed-fit promises) */
  guide: string;
  /** Approximate weight, where the supplier has given one */
  weight?: string;
  externalId?: string;
  available?: boolean;
};

export const SIZES: Size[] = [
  {
    id: '100x150',
    collection: 'classic',
    tier: 'M',
    name: 'Medium',
    label: '100 × 150 cm',
    widthCm: 100,
    lengthCm: 150,
    prices: { GBP: 4999, USD: 5999 },
    referencePrices: { GBP: null, USD: null },
    usChargeGBP: 4477, // ≈ $59.99
    guide: 'A smaller throw. Right for one person on the sofa, an armchair or the end of the bed.',
    weight: 'about 1.1 kg',
  },
  {
    id: '150x200',
    collection: 'classic',
    tier: 'L',
    name: 'Large',
    label: '150 × 200 cm',
    widthCm: 150,
    lengthCm: 200,
    prices: { GBP: 7999, USD: 8999 },
    referencePrices: { GBP: null, USD: null },
    usChargeGBP: 6716, // ≈ $89.99
    guide: 'Room to stretch out under, or to share with someone on the sofa. More coverage across a bed.',
  },
  {
    id: '200x230',
    collection: 'classic',
    tier: 'XL',
    name: 'Extra Large',
    label: '200 × 230 cm',
    widthCm: 200,
    lengthCm: 230,
    prices: { GBP: 8999, USD: 9999 },
    // UK reference price as briefed. US: set a figure here only if you have one to stand behind.
    referencePrices: { GBP: 11999, USD: null },
    usChargeGBP: 7462, // ≈ $99.99
    badge: 'Our largest',
    guide: 'Our biggest. Enough to share, to wrap right around you, or to spread generously across a bed.',
    weight: 'about 2.8 kg',
  },

  // ── Custom collection ──
  // US: shown in $ (the £ US price converted at about $1.335 to £1, rounded to the nearest …4.99 / …9.99);
  // checkout charges US orders `usChargeGBP`.
  // Reference ("compare at") prices: £20 above the UK price, as briefed.
  {
    id: 'custom-100x160',
    collection: 'custom',
    tier: 'M',
    name: 'Medium',
    label: '100 × 160 cm',
    widthCm: 100,
    lengthCm: 160,
    prices: { GBP: 4999, USD: 6499 },
    referencePrices: { GBP: 6999, USD: null },
    usChargeGBP: 4999, // ≈ $64.99
    guide: 'A throw for one. Right for the sofa, an armchair or the end of the bed.',
  },
  {
    id: 'custom-160x200',
    collection: 'custom',
    tier: 'L',
    name: 'Large',
    label: '160 × 200 cm',
    widthCm: 160,
    lengthCm: 200,
    prices: { GBP: 6999, USD: 11499 },
    referencePrices: { GBP: 8999, USD: null },
    usChargeGBP: 8499, // ≈ $114.99
    guide: 'Room to stretch out under, or to share with someone on the sofa. More coverage across a bed.',
  },
  {
    id: 'custom-200x230',
    collection: 'custom',
    tier: 'XL',
    name: 'Extra Large',
    label: '200 × 230 cm',
    widthCm: 200,
    lengthCm: 230,
    prices: { GBP: 8999, USD: 14499 },
    referencePrices: { GBP: 10999, USD: null },
    usChargeGBP: 10999, // ≈ $144.99
    badge: 'Our largest',
    guide: 'Our biggest. Enough to share, to wrap right around you, or to spread generously across a bed.',
  },
];

/* ───────────────────────────── OFFER ─────────────────────────────
 * The limited-time offer on the largest size. No end date is shown because
 * none has been set: if you add one, it must be real.
 */
export const PROMOTION = {
  enabled: true,
  /** Short label beside the price */
  label: 'Limited-time offer',
  /** Words used before the struck-through price for screen readers and the cart */
  referenceLabel: 'Regular price',
};

/* ───────────────────────────── FREE GIFT ─────────────────────────────
 * The Nimbus™ cloud pillow is never sold. It's added to the cart, the order
 * summary and the Square order automatically, at £0.
 *  • 'per-blanket' → one pillow for every blanket in the order (2 blankets = 2 pillows)
 *  • 'per-order'   → one pillow per order, however many blankets
 */
export type GiftMode = 'per-blanket' | 'per-order';

export const GIFT = {
  slug: 'nolla-nimbus',
  name: 'Nimbus™ cloud pillow',
  description: 'A soft, squishy 25 cm cloud pillow',
  supplierName: 'Plush cloud pillow, White, 25 cm',
  mode: 'per-blanket' as GiftMode,
  image: {
    src: '/images/nimbus/nimbus-cloud-pillow.webp',
    alt: 'The Nimbus cloud pillow: a fluffy white cloud with a little smile and two dangling legs, sitting on a wooden bench.',
  } satisfies ImageAsset,
};

export function giftQuantity(blanketCount: number): number {
  if (blanketCount <= 0) return 0;
  return GIFT.mode === 'per-blanket' ? blanketCount : 1;
}

/* ───────────────────────────── DEFAULTS ───────────────────────────── */

export type Selection = { colour: ColourId; size: SizeId };

/** What the purchase panel shows first. The largest size is the featured offer. */
export const DEFAULT_SELECTION: Selection = {
  colour: 'white',
  size: '200x230',
};

export const FEATURED_SIZE: SizeId = '200x230';

/* ───────────────────────────── HELPERS ───────────────────────────── */

export const getColour = (id: string): Colour | undefined => COLOURS.find((c) => c.id === id);
export const getSize = (id: string): Size | undefined => SIZES.find((s) => s.id === id);

/** The three sizes of a collection, smallest first */
export const sizesFor = (collection: Collection): Size[] => SIZES.filter((s) => s.collection === collection);

/** The collection a colour belongs to (defaults to classic) */
export const collectionOf = (colourId: string): Collection => getColour(colourId)?.collection ?? 'classic';

/** The same tier (Medium / Large / Extra Large) in another collection */
export function matchingSize(sizeId: SizeId, collection: Collection): SizeId {
  const tier = getSize(sizeId)?.tier ?? 'XL';
  return (sizesFor(collection).find((s) => s.tier === tier) ?? sizesFor(collection)[0]).id;
}

/** "Large (150 × 200 cm)" */
export const sizeDisplay = (size: Pick<Size, 'name' | 'label'>): string => `${size.name} (${size.label})`;

export function isValidSelection(sel: unknown): sel is Selection {
  const s = sel as Partial<Selection> | null;
  const colour = s ? getColour(String(s.colour)) : undefined;
  const size = s ? getSize(String(s.size)) : undefined;
  return Boolean(colour && size && colour.collection === size.collection && colour.available !== false && size.available !== false);
}

export type PriceInfo = {
  price: number;
  /** Struck-through comparison price, only when the offer is on and a reference is configured */
  reference: number | null;
};

export type Rates = Partial<Record<RegionId, number>>;

/** Convert a GBP amount (pence) into another currency's hundredths, rounded sensibly */
export function convertFromGBP(pence: number, to: RegionId, rates: Rates = FALLBACK_RATES): number {
  if (to === 'GBP') return pence;
  const rate = rates[to] ?? FALLBACK_RATES[to];
  const raw = pence * rate;
  return REGIONS[to].zeroDecimal ? Math.round(raw / 100) * 100 : Math.round(raw);
}

/** Price for a size in any currency. GBP and USD use their own lists; the rest convert from GBP. */
export function priceFor(sizeId: SizeId, region: RegionId, rates?: Rates): PriceInfo {
  const size = getSize(sizeId) ?? SIZES[SIZES.length - 1];
  const fixed = region === 'GBP' || region === 'USD';
  const price = fixed ? size.prices[region] : convertFromGBP(size.prices.GBP, region, rates);
  const refBase = fixed ? size.referencePrices[region] : size.referencePrices.GBP;
  const ref = PROMOTION.enabled && refBase ? (fixed ? refBase : convertFromGBP(refBase, region, rates)) : null;
  return { price, reference: ref && ref > price ? ref : null };
}

/** Delivery countries that pay the US price list */
export const US_PRICE_COUNTRIES = ['US'];

/**
 * The amount actually charged at checkout, always in GBP (pence).
 * Orders delivered to the US pay the US price list; everyone else pays the UK price.
 */
export function chargedPriceFor(sizeId: SizeId, deliveryCountry?: string): number {
  const size = getSize(sizeId) ?? SIZES[SIZES.length - 1];
  return deliveryCountry && US_PRICE_COUNTRIES.includes(deliveryCountry.toUpperCase()) ? size.usChargeGBP : size.prices.GBP;
}

/** "White / Extra Large (200 × 230 cm)" */
export function describeSelection(sel: Selection): string {
  const size = getSize(sel.size);
  return [getColour(sel.colour)?.label, size && sizeDisplay(size)].filter(Boolean).join(' / ');
}

/* ───────────────────────────── PHOTOGRAPHY ─────────────────────────────
 * Each colour has the same five shots. The gallery shows the chosen colour's
 * photos, then the free pillow. Swap a file in /public/images/nuv to change a photo.
 */

const SCENES: { key: string; describe: (c: string) => string }[] = [
  {
    key: 'draped',
    describe: (c) => `The ${c} Nolla Nuv Velvet Blanket draped over a boucle armchair by a sunny window.`,
  },
  {
    key: 'wrapped',
    describe: (c) => `A woman wrapped up in the ${c} Nuv blanket, smiling, in an armchair.`,
  },
  {
    key: 'texture',
    describe: (c) => `Close-up of the deep, rippled faux-fur surface of the ${c} Nuv blanket.`,
  },
  {
    key: 'bed',
    describe: (c) => `The ${c} Nuv blanket thrown across a made bed.`,
  },
  {
    key: 'family',
    describe: (c) => `A family laughing together on the sofa under the ${c} Nuv blanket.`,
  },
];

export function photoFor(colourId: ColourId, scene: 'draped' | 'wrapped' | 'texture' | 'bed' | 'family' | 'snuggled'): ImageAsset {
  const colour = getColour(colourId) ?? COLOURS[0];
  // Custom blankets only have the outdoor shoot: close-up for texture, the main shot otherwise
  if (colour.collection === 'custom') return customPhotosFor(colour.id)[scene === 'texture' ? 3 : 0];
  const s = SCENES.find((x) => x.key === scene);
  return {
    src: `/images/nuv/nuv-${colour.photos}-${scene}.webp`,
    alt: s
      ? s.describe(colour.label.toLowerCase())
      : `Someone snuggled up inside the ${colour.label.toLowerCase()} Nuv blanket in an armchair.`,
  };
}

/**
 * Outdoor photoshoot (6 per colour) in /public/images/nuv-outdoor.
 * Order: 1 sitting on a rock in the stream (whole blanket visible, the MAIN image),
 * 2 reclining on a fallen tree, 3 reclining (wide), 4 close-up, 5 by the tree, 6 among the roots.
 */
const OUTDOOR_ALTS = [
  'sitting on a rock by a woodland stream, the whole blanket draped around her',
  'reclining on a fallen tree, the blanket flowing to the ground',
  'leaning back on a fallen tree, wrapped in the blanket',
  'close-up, hugging the blanket around her shoulders',
  'sitting on a rock beside a tree, wrapped in the blanket',
  'resting among tree roots, wrapped in the blanket',
];

export function outdoorPhotosFor(colourId: ColourId): ImageAsset[] {
  const colour = getColour(colourId) ?? COLOURS[0];
  return OUTDOOR_ALTS.map((desc, i) => ({
    src: `/images/nuv-outdoor/nuv-${colour.photos}-outdoor-${i + 1}.webp`,
    alt: `A woman in the ${colour.label.toLowerCase()} Nolla Nuv blanket, ${desc}.`,
  }));
}

/**
 * Custom collection photos (6 per blanket) in /public/images/nuv-custom, same poses as the outdoor shoot:
 * 1 sitting on a rock in the stream (whole blanket, the MAIN image), 2 reclining on a fallen tree,
 * 3 reclining (looking at camera), 4 close-up, 5 on a rock beside a tree, 6 among the roots.
 */
export function customPhotosFor(colourId: ColourId): ImageAsset[] {
  const colour = getColour(colourId) ?? COLOURS[0];
  return OUTDOOR_ALTS.map((desc, i) => ({
    src: `/images/nuv-custom/nuv-${colour.photos}-${i + 1}.webp`,
    alt: `A woman in the ${colour.label} Nolla Nuv blanket, ${desc}.`,
  }));
}

/** Gallery: new outdoor and original indoor photos alternate (new first), then the free pillow. */
export function galleryFor(colourId: ColourId): ImageAsset[] {
  const colour = getColour(colourId) ?? COLOURS[0];
  if (colour.collection === 'custom') {
    return [...customPhotosFor(colour.id), { ...GIFT.image, alt: `Included free: ${GIFT.image.alt}` }];
  }
  const indoor = SCENES.map((s) => photoFor(colour.id, s.key as Parameters<typeof photoFor>[1]));
  // White has an extra snuggled-up shot (the only colour photographed this way)
  if (colour.id === 'white') indoor.splice(2, 0, photoFor('white', 'snuggled'));
  const outdoor = outdoorPhotosFor(colour.id);
  const mixed: ImageAsset[] = [];
  for (let i = 0; i < Math.max(outdoor.length, indoor.length); i++) {
    if (outdoor[i]) mixed.push(outdoor[i]);
    if (indoor[i]) mixed.push(indoor[i]);
  }
  return [...mixed, { ...GIFT.image, alt: `Included free: ${GIFT.image.alt}` }];
}

/** Thumbnail for cart lines */
export const cartImageFor = (colourId: ColourId): ImageAsset => photoFor(colourId, 'draped');
