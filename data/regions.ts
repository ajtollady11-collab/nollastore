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
  'GBP', 'USD', 'EUR', 'CAD', 'AUD', 'NZD', 'CHF', 'SEK', 'NOK', 'DKK',
  'PLN', 'CZK', 'HUF', 'RON', 'ISK', 'TRY', 'JPY', 'CNY', 'HKD', 'SGD',
  'KRW', 'INR', 'IDR', 'MYR', 'PHP', 'THB', 'ILS', 'MXN', 'BRL', 'ZAR',
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
    checkout: {
      // Flip to true once a USD-capable checkout is connected (see README → "US checkout")
      enabled: false,
      closedMessage:
        'Checkout in US dollars isn’t open yet. You can still order (including delivery to the US) by switching to pounds: you’ll pay the UK price in GBP and your card provider converts it.',
    },
  },
  EUR: C('EUR', '€', 'Euro', 'en-IE'),
  CAD: C('CAD', '$', 'Canadian dollar', 'en-CA'),
  AUD: C('AUD', '$', 'Australian dollar', 'en-AU'),
  NZD: C('NZD', '$', 'New Zealand dollar', 'en-NZ'),
  CHF: C('CHF', 'CHF', 'Swiss franc', 'de-CH'),
  SEK: C('SEK', 'kr', 'Swedish krona', 'sv-SE'),
  NOK: C('NOK', 'kr', 'Norwegian krone', 'nb-NO'),
  DKK: C('DKK', 'kr', 'Danish krone', 'da-DK'),
  PLN: C('PLN', 'zł', 'Polish złoty', 'pl-PL'),
  CZK: C('CZK', 'Kč', 'Czech koruna', 'cs-CZ', true),
  HUF: C('HUF', 'Ft', 'Hungarian forint', 'hu-HU', true),
  RON: C('RON', 'lei', 'Romanian leu', 'ro-RO'),
  ISK: C('ISK', 'kr', 'Icelandic króna', 'is-IS', true),
  TRY: C('TRY', '₺', 'Turkish lira', 'tr-TR'),
  JPY: C('JPY', '¥', 'Japanese yen', 'ja-JP', true),
  CNY: C('CNY', '¥', 'Chinese yuan', 'zh-CN'),
  HKD: C('HKD', '$', 'Hong Kong dollar', 'en-HK'),
  SGD: C('SGD', '$', 'Singapore dollar', 'en-SG'),
  KRW: C('KRW', '₩', 'South Korean won', 'ko-KR', true),
  INR: C('INR', '₹', 'Indian rupee', 'en-IN'),
  IDR: C('IDR', 'Rp', 'Indonesian rupiah', 'id-ID', true),
  MYR: C('MYR', 'RM', 'Malaysian ringgit', 'ms-MY'),
  PHP: C('PHP', '₱', 'Philippine peso', 'en-PH'),
  THB: C('THB', '฿', 'Thai baht', 'th-TH'),
  ILS: C('ILS', '₪', 'Israeli new shekel', 'he-IL'),
  MXN: C('MXN', '$', 'Mexican peso', 'es-MX'),
  BRL: C('BRL', 'R$', 'Brazilian real', 'pt-BR'),
  ZAR: C('ZAR', 'R', 'South African rand', 'en-ZA'),
};

/**
 * Fallback exchange rates: units of each currency per £1.
 * Only used if live rates can't be fetched (see RATES_URL). Approximate.
 */
export const FALLBACK_RATES: Record<RegionId, number> = {
  GBP: 1, USD: 1.34, EUR: 1.17, CAD: 1.85, AUD: 2.05, NZD: 2.25, CHF: 1.08, SEK: 12.8, NOK: 13.5, DKK: 8.7,
  PLN: 4.95, CZK: 29.2, HUF: 460, RON: 5.9, ISK: 185, TRY: 55, JPY: 200, CNY: 9.7, HKD: 10.5, SGD: 1.73,
  KRW: 1850, INR: 115, IDR: 22000, MYR: 5.75, PHP: 77, THB: 44, ILS: 4.6, MXN: 25, BRL: 7.4, ZAR: 24,
};

/** Free, keyless exchange-rate feed (GBP base). Cached on each device for 12 hours. */
export const RATES_URL = 'https://open.er-api.com/v6/latest/GBP';

export const DEFAULT_REGION: RegionId = 'GBP';
export const REGION_IDS = [...CURRENCY_CODES] as RegionId[];

export function isRegionId(value: unknown): value is RegionId {
  return typeof value === 'string' && value in REGIONS;
}
