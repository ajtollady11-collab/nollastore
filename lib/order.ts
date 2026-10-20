import { countries, UK_CODE } from '@/data/countries';
import { GIFT, PRODUCT, chargedPriceFor, getColour, getSize, giftQuantity, isValidSelection, type Selection } from '@/data/product';
import { REGIONS, isRegionId, type CurrencyCode, type RegionId } from '@/data/regions';
import { shippingRegions, type ShippingMethodId } from '@/data/site';
import { discountCodes } from '@/data/marketing';
import { MAX_QTY } from './cart';

/**
 * Builds a priced order from cart lines, using ONLY the prices in
 * data/product.ts. The checkout API uses this to charge, so what customers
 * see is what Square charges. Everything from the browser is untrusted.
 */

export type OrderInputLine = { selection: Selection; quantity: number };

export type PricedLine = {
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  isGift?: boolean;
};

export type PricedOrder = {
  region: RegionId;
  currency: CurrencyCode;
  lines: PricedLine[];
  subtotal: number;
  discount: { code: string; percent: number; amount: number } | null;
  shipping: { id: ShippingMethodId; label: string; price: number };
  total: number;
};

export type OrderResult = { ok: true; order: PricedOrder } | { ok: false; error: string };

export function normaliseCode(code: string | null | undefined): string | null {
  const c = (code ?? '').trim().toUpperCase();
  return c && discountCodes[c] ? c : null;
}

function findShipping(id: string) {
  for (const region of Object.values(shippingRegions)) {
    const m = region.methods.find((x) => x.id === id);
    if (m) return m;
  }
  return null;
}

export function priceOrder(
  inputLines: OrderInputLine[],
  shippingId: string,
  code: string | null | undefined,
  regionInput: unknown,
  deliveryCountry?: string,
): OrderResult {
  // regionInput = the currency the shopper browsed in; everything is charged in GBP
  // Older carts may send 'uk' / 'us'
  const normalised = regionInput === 'uk' ? 'GBP' : regionInput === 'us' ? 'USD' : regionInput;
  if (!isRegionId(normalised)) return { ok: false, error: 'Please choose a currency.' };
  const region = normalised;
  if (!REGIONS[region].checkout.enabled) {
    return { ok: false, error: REGIONS[region].checkout.closedMessage ?? 'Checkout isn’t available in this currency yet.' };
  }
  if (!Array.isArray(inputLines) || inputLines.length === 0) return { ok: false, error: 'Your bag is empty.' };
  if (inputLines.length > 20) return { ok: false, error: 'Too many items in the bag.' };

  const lines: PricedLine[] = [];
  let blankets = 0;
  for (const l of inputLines) {
    if (!isValidSelection(l?.selection)) return { ok: false, error: 'An item in your bag is no longer available. Please choose it again.' };
    const qty = Number(l.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { ok: false, error: 'Invalid quantity.' };
    const colour = getColour(l.selection.colour)!;
    const size = getSize(l.selection.size)!;
    blankets += qty;
    lines.push({
      name: PRODUCT.name,
      // Supplier colour name in brackets when it differs, so the order is unambiguous to fulfil
      variant: `${colour.label}${colour.supplierName !== colour.label ? ` (${colour.supplierName})` : ''} / ${size.label}`,
      quantity: qty,
      // Always charged in GBP: the US price list for US deliveries, the UK price otherwise
      unitPrice: chargedPriceFor(size.id, deliveryCountry),
    });
  }

  const shippingMethod = findShipping(shippingId);
  if (!shippingMethod) return { ok: false, error: 'Please choose a delivery option.' };

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const validCode = normaliseCode(code);
  const discount = validCode
    ? { code: validCode, percent: discountCodes[validCode].percent, amount: Math.round((subtotal * discountCodes[validCode].percent) / 100) }
    : null;

  // The free pillow rides along automatically, at zero cost
  const pillows = giftQuantity(blankets);
  if (pillows > 0) {
    lines.push({ name: `FREE GIFT: ${GIFT.name}`, variant: 'White, 25 cm', quantity: pillows, unitPrice: 0, isGift: true });
  }

  return {
    ok: true,
    order: {
      region,
      currency: 'GBP',
      lines,
      subtotal,
      discount,
      shipping: { id: shippingMethod.id, label: shippingMethod.label, price: shippingMethod.price },
      total: subtotal - (discount?.amount ?? 0) + shippingMethod.price,
    },
  };
}

/* ───────────────────────── Delivery details ───────────────────────── */

export type DeliveryDetails = {
  email: string;
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  postcode: string;
  country: string;
};

export type DeliveryResult = { ok: true; delivery: DeliveryDetails } | { ok: false; error: string; field?: keyof DeliveryDetails };

const clip = (v: unknown, max = 120) => String(v ?? '').trim().slice(0, max);

/** Validates delivery details and that the delivery option matches the country. */
export function validateDelivery(input: Partial<DeliveryDetails> | undefined, shippingId: string): DeliveryResult {
  const d: DeliveryDetails = {
    email: clip(input?.email, 160).toLowerCase(),
    name: clip(input?.name),
    phone: clip(input?.phone, 40),
    address1: clip(input?.address1),
    address2: clip(input?.address2),
    city: clip(input?.city, 80),
    region: clip(input?.region, 80),
    postcode: clip(input?.postcode, 20).toUpperCase(),
    country: clip(input?.country, 2).toUpperCase(),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return { ok: false, error: 'Please enter a valid email address.', field: 'email' };
  if (d.name.length < 2) return { ok: false, error: 'Please enter your full name.', field: 'name' };
  if (d.phone.replace(/\D/g, '').length < 7) return { ok: false, error: 'Please enter a phone number for the courier.', field: 'phone' };
  if (!countries.some((c) => c.code === d.country)) return { ok: false, error: 'Please choose your country.', field: 'country' };
  if (d.address1.length < 3) return { ok: false, error: 'Please enter your address.', field: 'address1' };
  if (d.city.length < 2) return { ok: false, error: 'Please enter your town or city.', field: 'city' };
  if (d.postcode.length < 2) return { ok: false, error: 'Please enter your postcode.', field: 'postcode' };

  const isUK = d.country === UK_CODE;
  if (isUK && shippingId !== 'uk-free') return { ok: false, error: 'Please choose a UK delivery option.' };
  if (!isUK && !shippingId.startsWith('intl-')) return { ok: false, error: 'Please choose an international delivery option.' };
  return { ok: true, delivery: d };
}
