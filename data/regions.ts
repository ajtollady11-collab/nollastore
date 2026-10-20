/**
 * ─────────────────────────────────────────────────────────────
 *  STOREFRONT REGIONS (UK / US)
 *  Everything that changes with the storefront selector lives here:
 *  currency, number formatting, delivery wording and whether checkout
 *  is open. Prices themselves live with each size in data/product.ts.
 *
 *  The selector changes what the customer SEES. It does not change the
 *  delivery destination (chosen on the checkout page) or the currency
 *  Square charges in (set by the Square location). See README → "US checkout".
 * ─────────────────────────────────────────────────────────────
 */

export type RegionId = 'uk' | 'us';
export type CurrencyCode = 'GBP' | 'USD';

export type Region = {
  id: RegionId;
  /** Full name, e.g. in the selector menu */
  label: string;
  /** Compact label for the header button */
  short: string;
  currency: CurrencyCode;
  symbol: string;
  locale: string;
  checkout: {
    /**
     * true = the cart's Checkout button goes to /checkout and Square.
     * The current Square location charges in GBP, so only the UK storefront can take payment today.
     */
    enabled: boolean;
    /** Shown in the cart and on /checkout when checkout is closed for this storefront */
    closedMessage?: string;
  };
  delivery: {
    /** Short line for trust rows (only claim "free" if it's genuinely configured) */
    short: string;
    /** One or two sentences for the purchase panel and FAQ */
    detail: string;
  };
};

export const REGIONS: Record<RegionId, Region> = {
  uk: {
    id: 'uk',
    label: 'United Kingdom (£ GBP)',
    short: 'UK · £',
    currency: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    checkout: { enabled: true },
    delivery: {
      // Matches the UK free-delivery method configured in data/site.ts → shippingRegions
      short: 'Free UK delivery',
      detail: 'Free UK delivery, usually 5–11 working days from your order. Delivery times are estimates, not guarantees.',
    },
  },
  us: {
    id: 'us',
    label: 'United States ($ USD)',
    short: 'US · $',
    currency: 'USD',
    symbol: '$',
    locale: 'en-US',
    checkout: {
      // Flip to true once a USD-capable checkout is connected (see README → "US checkout")
      enabled: false,
      closedMessage:
        'US checkout in dollars isn’t open yet. You can still order for delivery to the US from our UK store, priced in pounds with international delivery added at checkout.',
    },
    delivery: {
      // No US delivery times have been confirmed by the supplier, so none are promised here
      short: 'Ships to the US',
      detail: 'US delivery options and costs are shown at checkout before you pay. Delivery times vary by destination.',
    },
  },
};

export const DEFAULT_REGION: RegionId = 'uk';
export const REGION_IDS = Object.keys(REGIONS) as RegionId[];

export function isRegionId(value: unknown): value is RegionId {
  return typeof value === 'string' && value in REGIONS;
}
