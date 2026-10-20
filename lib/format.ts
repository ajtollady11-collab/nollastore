import { REGIONS, type RegionId } from '@/data/regions';

const formatters = new Map<RegionId, Intl.NumberFormat>();
const AMBIGUOUS = new Set<RegionId>(['CAD', 'AUD', 'NZD', 'HKD', 'SGD', 'MXN', 'CNY']);

/**
 * Format an amount held in hundredths (pence, cents…) for a currency,
 * e.g. (8999, 'GBP') → "£89.99", (1800000, 'JPY') → "¥18,000".
 */
export function formatMoney(amount: number, currency: RegionId): string {
  let f = formatters.get(currency);
  if (!f) {
    const r = REGIONS[currency];
    const digits = r.zeroDecimal ? 0 : 2;
    // English formatting everywhere (the site is in English), with the short local symbol: €105.29, ¥17,998, kr 1,152.00
    f = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-GB', {
      style: 'currency',
      currency,
      // Dollar/yen currencies keep their prefix (CA$, A$, S$, CN¥) so they can't be mistaken for $ / ¥
      currencyDisplay: r.pricing === 'converted' && !AMBIGUOUS.has(currency) ? 'narrowSymbol' : 'symbol',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    formatters.set(currency, f);
  }
  return f.format(amount / 100);
}

/** GBP: what checkout actually charges (delivery methods, the Square order) */
export function formatPrice(pence: number): string {
  return formatMoney(pence, 'GBP');
}
