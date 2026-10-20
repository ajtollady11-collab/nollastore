/**
 * ─────────────────────────────────────────────────────────────
 *  CURRENCIES (the storefront selector)
 *
 *  • GBP and USD have their own set prices (data/product.ts → SIZES[].prices).
 *  • Every other currency is a CONVERSION of the GBP price, for display only,
 *    using live exchange rates (with the fallback table below if they can't load).
 *
 *  Checkout charges in pounds (GBP): the Square location is a UK one.
 *  Converted currencies can check out (charged in GBP, the bank converts).
 *  USD has its own retail prices, so it can't simply be charged in GBP:
 *  it stays closed until a USD checkout is connected (see README → "US checkout").
 * ─────────────────────────────────────────────────────────────
 */

export const CURRENCY_CODES = [
  // Only the currencies of the countries we ship to (data/countries.ts)
  'GBP', 'USD', 'EUR', 'CAD', 'MXN', 'AUD', 'NZD', 'SEK', 'NOK',
] as const;

export type RegionId = (typeof CURRENCY_CODES)[number];
export type CurrencyCode = RegionId;

export type Region = {
  id: RegionId;
  /** Symbol shown in the selector, e.g. "kr" */
  symbol: string;
  /** Full name, for screen readers and the mobile menu */
  name: string;
  locale: string;
  /** Whole numbers only (e.g. ¥, ₩) */
  zeroDecimal?: boolean;
  /** 'fixed' = our own price list; 'converted' = GBP price × exchange rate */
  pricing: 'fixed' | 'converted';
  checkout: {
    enabled: boolean;
    closedMessage?: string;
  };
};

const C = (id: RegionId, symbol: string, name: string, locale: string, zeroDecimal = false): Region => ({
  id,
  symbol,
  name,
  locale,
  zeroDecimal,
  pricing: 'converted',
  checkout: { enabled: true },
});

export const REGIONS: Record<RegionId, Region> = {
  GBP: { id: 'GBP', symbol: '£', name: 'British pound', locale: 'en-GB', pricing: 'fixed', checkout: { enabled: true } },
  USD: {
    id: 'USD',
    symbol: '$',
    name: 'US dollar',
    locale: 'en-US',
    pricing: 'fixed',
    // US orders pay the US price list, charged in GBP (data/product.ts → usChargeGBP)
    checkout: { enabled: true },
  },
  EUR: C('EUR', '€', 'Euro', 'en-IE'),
  CAD: C('CAD', '$', 'Canadian dollar', 'en-CA'),
  AUD: C('AUD', '$', 'Australian dollar', 'en-AU'),
  NZD: C('NZD', '$', 'New Zealand dollar', 'en-NZ'),
  SEK: C('SEK', 'kr', 'Swedish krona', 'sv-SE'),
  NOK: C('NOK', 'kr', 'Norwegian krone', 'nb-NO'),
  MXN: C('MXN', '$', 'Mexican peso', 'es-MX'),
};

/**
 * Fallback exchange rates: units of each currency per £1.
 * Only used if live rates can't be fetched (see RATES_URL). Approximate.
 */
export const FALLBACK_RATES: Record<RegionId, number> = {
  GBP: 1, USD: 1.34, EUR: 1.17, CAD: 1.85, MXN: 25, AUD: 2.05, NZD: 2.25, SEK: 12.8, NOK: 13.5,
};

/** Free, keyless exchange-rate feed (GBP base). Cached on each device for 12 hours. */
export const RATES_URL = 'https://open.er-api.com/v6/latest/GBP';

export const DEFAULT_REGION: RegionId = 'GBP';
export const REGION_IDS = [...CURRENCY_CODES] as RegionId[];

export function isRegionId(value: unknown): value is RegionId {
  return typeof value === 'string' && value in REGIONS;
}
