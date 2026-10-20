import 'server-only';
import { randomUUID } from 'node:crypto';
import type { DeliveryDetails, PricedOrder } from './order';
import { countryName } from '@/data/countries';

/**
 * Square Checkout API: creates a Square-hosted PAYMENT page for an order.
 * Delivery details are collected on our own /checkout page (Square's own
 * address/shipping step proved unreliable), so Square only takes the card.
 * The customer's name, address, email and phone are attached to the order
 * as a shipment fulfilment and summarised in the payment note.
 *
 * SERVER ONLY. Environment variables (set in Vercel):
 *   SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_ENVIRONMENT ("sandbox" | "production")
 * Optional: SQUARE_API_BASE_URL overrides the API host (local testing).
 */

const SQUARE_VERSION = '2024-01-18';

// Trim + normalise so a stray space or capital letter in Vercel's settings can't break checkout
const env = (key: string) => (process.env[key] ?? '').trim();
const isProduction = () => env('SQUARE_ENVIRONMENT').toLowerCase() === 'production';

export function squareConfigured(): boolean {
  return Boolean(env('SQUARE_ACCESS_TOKEN') && env('SQUARE_LOCATION_ID'));
}

function apiBase(): string {
  if (env('SQUARE_API_BASE_URL')) return env('SQUARE_API_BASE_URL').replace(/\/$/, '');
  return isProduction() ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com';
}


/** Optional parts that are dropped one by one if Square rejects them */
type Options = {
  includeGift: boolean;
  includeFulfillment: boolean;
  shippingAs: 'service_charge' | 'line_item';
  prefillEmail: boolean;
};

function deliverySummary(d: DeliveryDetails, order: PricedOrder): string {
  const address = [d.address1, d.address2, d.city, d.region, d.postcode, countryName(d.country)].filter(Boolean).join(', ');
  return `SHIP TO: ${d.name}, ${address} | ${d.phone} | ${d.email} | ${order.shipping.label}`.slice(0, 480);
}

export function buildPaymentLinkBody(
  order: PricedOrder,
  delivery: DeliveryDetails,
  ctx: { redirectUrl: string; supportEmail?: string },
  opt: Options,
) {
  const money = (amount: number) => ({ amount, currency: order.currency });
  const products = order.lines.filter((l) => opt.includeGift || !l.isGift);
  const discountAsLineItems = Boolean(order.discount) && opt.shippingAs === 'line_item';

  const lineItems: Record<string, unknown>[] = products.map((l) => ({
    // Name includes the colour and size so it's obvious what to order from CJ
    name: l.variant ? `${l.name} (${l.variant})` : l.name,
    quantity: String(l.quantity),
    base_price_money: money(l.unitPrice),
    ...(discountAsLineItems && !l.isGift && { applied_discounts: [{ discount_uid: 'code' }] }),
  }));
  if (opt.shippingAs === 'line_item' && order.shipping.price > 0) {
    lineItems.push({ name: `Delivery: ${order.shipping.label}`, quantity: '1', base_price_money: money(order.shipping.price) });
  }

  return {
    idempotency_key: randomUUID(),
    order: {
      location_id: env('SQUARE_LOCATION_ID'),
      line_items: lineItems,
      ...(order.discount && {
        discounts: [
          {
            uid: 'code',
            name: `${order.discount.code} (${order.discount.percent}% off)`,
            percentage: String(order.discount.percent),
            scope: discountAsLineItems ? 'LINE_ITEM' : 'ORDER',
          },
        ],
      }),
      ...(opt.shippingAs === 'service_charge' &&
        order.shipping.price > 0 && {
          service_charges: [
            { name: order.shipping.label, amount_money: money(order.shipping.price), calculation_phase: 'SUBTOTAL_PHASE', taxable: false },
          ],
        }),
      ...(opt.includeFulfillment && {
        fulfillments: [
          {
            type: 'SHIPMENT',
            state: 'PROPOSED',
            shipment_details: {
              recipient: {
                display_name: delivery.name,
                email_address: delivery.email,
                phone_number: delivery.phone,
                address: {
                  address_line_1: delivery.address1,
                  ...(delivery.address2 && { address_line_2: delivery.address2 }),
                  locality: delivery.city,
                  ...(delivery.region && { administrative_district_level_1: delivery.region }),
                  postal_code: delivery.postcode,
                  country: delivery.country,
                },
              },
            },
          },
        ],
      }),
    },
    checkout_options: {
      redirect_url: ctx.redirectUrl,
      // We collect the address ourselves; Square only takes payment
      ask_for_shipping_address: false,
      accepted_payment_methods: { apple_pay: true, google_pay: true },
      // Hide Square's own coupon/loyalty boxes: discount codes are applied on our checkout page
      enable_coupon: false,
      enable_loyalty: false,
      ...(ctx.supportEmail && { merchant_support_email: ctx.supportEmail }),
    },
    ...(opt.prefillEmail && { pre_populated_data: { buyer_email: delivery.email } }),
    // Always visible on the payment in your Square dashboard, even if a fallback kicked in
    payment_note: `${deliverySummary(delivery, order)}${opt.includeGift ? '' : ` | + FREE Nimbus cloud pillow x${order.lines.find((l) => l.isGift)?.quantity ?? 1}`}`,
  };
}

export type PaymentLinkResult = { ok: true; url: string; orderId?: string } | { ok: false; status: number; detail: string };

async function post(body: unknown): Promise<PaymentLinkResult> {
  const res = await fetch(`${apiBase()}/v2/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('SQUARE_ACCESS_TOKEN')}`,
      'Square-Version': SQUARE_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => ({}))) as {
    payment_link?: { url?: string; order_id?: string };
    errors?: { code?: string; detail?: string; field?: string }[];
  };
  if (res.ok && json.payment_link?.url) return { ok: true, url: json.payment_link.url, orderId: json.payment_link.order_id };
  if (res.status === 401) {
    console.error(`[checkout] Square says the access token is wrong for ${isProduction() ? 'PRODUCTION' : 'SANDBOX'}. Check SQUARE_ACCESS_TOKEN and SQUARE_ENVIRONMENT in Vercel.`);
  }
  const detail = json.errors?.map((e) => [e.code, e.field, e.detail].filter(Boolean).join(': ')).join(' | ') || `HTTP ${res.status}`;
  return { ok: false, status: res.status, detail };
}

export async function createPaymentLink(
  order: PricedOrder,
  delivery: DeliveryDetails,
  ctx: { redirectUrl: string; supportEmail?: string },
): Promise<PaymentLinkResult> {
  let opt: Options = { includeGift: true, includeFulfillment: true, shippingAs: 'service_charge', prefillEmail: true };
  let result = await post(buildPaymentLinkBody(order, delivery, ctx, opt));

  // If Square rejects an optional part, drop just that part and retry
  for (let i = 0; i < 4 && !result.ok && result.status < 500; i++) {
    const d = result.detail;
    const next: Options = { ...opt };
    if (opt.includeFulfillment && /fulfillment|recipient|shipment|phone|postal|address/i.test(d)) next.includeFulfillment = false;
    else if (opt.shippingAs === 'service_charge' && /service_charge/i.test(d)) next.shippingAs = 'line_item';
    else if (opt.prefillEmail && /pre_populated|buyer_email/i.test(d)) next.prefillEmail = false;
    else if (opt.includeGift && /line_items|base_price_money|amount/i.test(d)) next.includeGift = false;
    else break;
    console.warn('[checkout] Square rejected an optional field, retrying without it:', d);
    opt = next;
    result = await post(buildPaymentLinkBody(order, delivery, ctx, opt));
  }
  return result;
}
