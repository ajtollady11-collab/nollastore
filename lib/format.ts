import { REGIONS, type RegionId } from '@/data/regions';

const formatters = new Map<RegionId, Intl.NumberFormat>();

/** Format an integer amount in the smallest unit for a storefront, e.g. (8999, 'uk') → "£89.99" */
export function formatMoney(amount: number, region: RegionId): string {
  let f = formatters.get(region);
  if (!f) {
    const r = REGIONS[region];
    f = new Intl.NumberFormat(r.locale, { style: 'currency', currency: r.currency, minimumFractionDigits: 2 });
    formatters.set(region, f);
  }
  return f.format(amount / 100);
}

/** GBP formatting for things that are always charged in pounds (delivery methods, the Square order) */
export function formatPrice(pence: number): string {
  return formatMoney(pence, 'uk');
}
