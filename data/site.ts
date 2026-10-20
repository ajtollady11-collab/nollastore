/**
 * Site-wide settings. Edit these values rather than hunting through components.
 */
export const site = {
  name: 'nolla',
  tagline: 'make staying in feel better.',
  description:
    'The Nolla Nuv™ Velvet Blanket: deep, rippled faux fur in six colours and three sizes, with a free cloud pillow in every order.',
  /** Live site address (set NEXT_PUBLIC_SITE_URL in Vercel when the domain changes) */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nolla-rose.vercel.app',

  /**
   * Logo. Leave `src` as null to use the serif wordmark.
   * When a logo file is ready, put it in /public/brand and set e.g. '/brand/nolla-logo.svg'.
   */
  logo: {
    src: null as string | null,
    width: 120,
    height: 40,
  },

  /** Customer contact email: shown on Contact, legal pages and FAQs */
  contactEmail: 'nullacomfort@outlook.com',
};

/** Header navigation. Keep it short: we sell one thing. */
export const navLinks = [
  { label: 'Shop', href: '/#shop' },
  { label: 'Our story', href: '/#story' },
  { label: 'FAQ', href: '/#faq' },
];

export const footerLinks = [
  {
    title: 'Shop',
    links: [
      { label: 'Nuv™ Velvet Blanket', href: '/#shop' },
      { label: 'Size guide', href: '/#size-guide' },
      { label: 'The free cloud pillow', href: '/#gift' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Shipping & returns', href: '/shipping-returns' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
    ],
  },
];

/**
 * Social accounts shown in the footer. Add the real profile links, e.g.
 *   { name: 'TikTok', href: 'https://www.tiktok.com/@yourhandle', icon: 'tiktok' },
 * The icons stay hidden while this list is empty.
 */
export const socials: { name: string; href: string; icon: 'tiktok' | 'instagram' | 'pinterest' }[] = [];

/**
 * Announcement bar. `everywhere` shows in both storefronts;
 * `uk` / `us` add region-specific lines (only offers that are genuinely configured).
 * On phones only the first message shows.
 */
export const announcement = {
  everywhere: ['A little cloud pillow comes free with every blanket'],
  uk: ['Free UK delivery', '14-day returns'],
  us: ['Now showing US prices'],
};

/**
 * ─────────────────────────────────────────────────────────────
 *  DELIVERY METHODS (used by the cart total and the Square order)
 *  These are charged in GBP by the UK checkout.
 *  UK: free standard only. Everywhere else: standard or express insured.
 *  UK estimate is based on CJ's figures (1–4 days processing + 4–7 days delivery).
 * ─────────────────────────────────────────────────────────────
 */
export type ShippingRegion = 'uk' | 'international';
export type ShippingMethodId = 'uk-free' | 'intl-standard' | 'intl-express';

export type ShippingMethod = { id: ShippingMethodId; label: string; price: number; estimate: string };

export const shippingRegions: Record<ShippingRegion, { id: ShippingRegion; label: string; methods: ShippingMethod[] }> = {
  uk: {
    id: 'uk',
    label: 'United Kingdom',
    methods: [{ id: 'uk-free', label: 'Free UK delivery', price: 0, estimate: 'Usually 5–11 working days' }],
  },
  international: {
    id: 'international',
    label: 'Outside the UK',
    methods: [
      // PLACEHOLDER: confirm international delivery times with the supplier
      { id: 'intl-standard', label: 'Standard delivery', price: 671, estimate: 'Tracked. Times vary by country' },
      { id: 'intl-express', label: 'Express insured shipping', price: 1113, estimate: 'Faster, tracked and insured' },
    ],
  },
};

/** Delivery wording reused across the site, so it can never contradict the Shipping & Returns page */
export const deliveryCopy = {
  ukEstimate: '5–11 working days',
  multiplePackages: 'Your blanket and pillow may arrive in separate packages, each with its own tracking.',
  returns: '14 days to change your mind',
  returnsDetail: 'Cancel for any reason within 14 days of receiving your order. Faulty or wrong items are on us.',
};
