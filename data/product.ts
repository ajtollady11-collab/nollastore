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

export type ColourId = 'white' | 'coffee' | 'pink' | 'green' | 'grey' | 'black';

export type Colour = {
  id: ColourId;
  /** Customer-facing name */
  label: string;
  /** Name in the supplier catalogue, sent with the order so fulfilment is unambiguous */
  supplierName: string;
  /** Swatch colour, sampled from the photography */
  swatch: string;
  /** File prefix in /public/images/nuv */
  photos: string;
  /** Square variation id (per colour/size), once the catalogue is set up */
  externalId?: string;
  available?: boolean;
};

export const COLOURS: Colour[] = [
  { id: 'white', label: 'White', supplierName: 'White', swatch: '#EEE8DE', photos: 'tosca-white' },
  { id: 'coffee', label: 'Coffee', supplierName: 'Coffee', swatch: '#CDB394', photos: 'coffee' },
  { id: 'pink', label: 'Pink', supplierName: 'Powder Pink', swatch: '#DDB4B0', photos: 'pink' },
  { id: 'green', label: 'Green', supplierName: 'Green', swatch: '#C3CCAD', photos: 'sage' },
  { id: 'grey', label: 'Grey', supplierName: 'Gray', swatch: '#AAA8A3', photos: 'grey' },
  { id: 'black', label: 'Black', supplierName: 'Black', swatch: '#2F2E2E', photos: 'charcoal' },
];

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

export type SizeId = '100x150' | '150x200' | '200x230';

export type Size = {
  id: SizeId;
  label: string;
  widthCm: number;
  lengthCm: number;
  prices: { GBP: number; USD: number };
  /** Converted currencies follow the GBP reference price */
  referencePrices: { GBP: number | null; USD: number | null };
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
    label: '100 × 150 cm',
    widthCm: 100,
    lengthCm: 150,
    prices: { GBP: 4999, USD: 7499 },
    referencePrices: { GBP: null, USD: null },
    guide: 'A smaller throw. Right for one person on the sofa, an armchair or the end of the bed.',
    weight: 'about 1.1 kg',
  },
  {
    id: '150x200',
    label: '150 × 200 cm',
    widthCm: 150,
    lengthCm: 200,
    prices: { GBP: 7999, USD: 11499 },
    referencePrices: { GBP: null, USD: null },
    guide: 'Room to stretch out under, or to share with someone on the sofa. More coverage across a bed.',
  },
  {
    id: '200x230',
    label: '200 × 230 cm',
    widthCm: 200,
    lengthCm: 230,
    prices: { GBP: 8999, USD: 12499 },
    // UK reference price as briefed. US: set a figure here only if you have one to stand behind.
    referencePrices: { GBP: 11999, USD: null },
    badge: 'Our largest',
    guide: 'Our biggest. Enough to share, to wrap right around you, or to spread generously across a bed.',
    weight: 'about 2.8 kg',
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
export const DEFAULT_SELECTION: Selection = { colour: 'white', size: '200x230' };

export const FEATURED_SIZE: SizeId = '200x230';

/* ───────────────────────────── HELPERS ───────────────────────────── */

export const getColour = (id: string): Colour | undefined => COLOURS.find((c) => c.id === id);
export const getSize = (id: string): Size | undefined => SIZES.find((s) => s.id === id);

export function isValidSelection(sel: unknown): sel is Selection {
  const s = sel as Partial<Selection> | null;
  const colour = s ? getColour(String(s.colour)) : undefined;
  const size = s ? getSize(String(s.size)) : undefined;
  return Boolean(colour && size && colour.available !== false && size.available !== false);
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

/** The amount actually charged at checkout (always GBP today) */
export const chargedPriceFor = (sizeId: SizeId) => priceFor(sizeId, 'GBP').price;

/** "White / 200 × 230 cm" */
export function describeSelection(sel: Selection): string {
  return [getColour(sel.colour)?.label, getSize(sel.size)?.label].filter(Boolean).join(' / ');
}

/* ───────────────────────────── PHOTOGRAPHY ─────────────────────────────
 * Each colour has the same five shots. The gallery shows the chosen colour's
 * photos, then the free pillow. Swap a file in /public/images/nuv to change a photo.
 */

const SCENES: { key: string; describe: (c: string) => string }[] = [
  { key: 'draped', describe: (c) => `The ${c} Nolla Nuv Velvet Blanket draped over a boucle armchair by a sunny window.` },
  { key: 'wrapped', describe: (c) => `A woman wrapped up in the ${c} Nuv blanket, smiling, in an armchair.` },
  { key: 'texture', describe: (c) => `Close-up of the deep, rippled faux-fur surface of the ${c} Nuv blanket.` },
  { key: 'bed', describe: (c) => `The ${c} Nuv blanket thrown across a made bed.` },
  { key: 'family', describe: (c) => `A family laughing together on the sofa under the ${c} Nuv blanket.` },
];

export function photoFor(colourId: ColourId, scene: 'draped' | 'wrapped' | 'texture' | 'bed' | 'family' | 'snuggled'): ImageAsset {
  const colour = getColour(colourId) ?? COLOURS[0];
  const s = SCENES.find((x) => x.key === scene);
  return {
    src: `/images/nuv/nuv-${colour.photos}-${scene}.webp`,
    alt: s
      ? s.describe(colour.label.toLowerCase())
      : `Someone snuggled up inside the ${colour.label.toLowerCase()} Nuv blanket in an armchair.`,
  };
}

export function galleryFor(colourId: ColourId): ImageAsset[] {
  const colour = getColour(colourId) ?? COLOURS[0];
  const shots = SCENES.map((s) => photoFor(colour.id, s.key as Parameters<typeof photoFor>[1]));
  // White has an extra snuggled-up shot (the only colour photographed this way)
  if (colour.id === 'white') {
    shots.splice(2, 0, photoFor('white', 'snuggled'));
  }
  return [...shots, { ...GIFT.image, alt: `Included free: ${GIFT.image.alt}` }];
}

/** Thumbnail for cart lines */
export const cartImageFor = (colourId: ColourId): ImageAsset => photoFor(colourId, 'draped');
