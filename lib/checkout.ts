import type { CartLine } from './cart';
import type { ShippingMethodId } from '@/data/site';
import type { RegionId } from '@/data/regions';
import type { DeliveryDetails } from './order';

/**
 * Starts checkout: sends the bag to /api/checkout, which re-prices it on the
 * server and creates a Square-hosted payment page. Returns its URL.
 * Only colours, sizes, quantities and the storefront are sent; prices are never
 * trusted from the browser. The free pillow is added by the server.
 */
export type CheckoutResult = { ok: false; message: string; field?: keyof DeliveryDetails } | { ok: true; redirectUrl: string };

export async function startCheckout(
  region: RegionId,
  lines: CartLine[],
  shipping: ShippingMethodId,
  discountCode: string | null,
  delivery: DeliveryDetails,
): Promise<CheckoutResult> {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        region,
        lines: lines.map((l) => ({ selection: l.selection, quantity: l.quantity })),
        shippingMethod: shipping,
        discountCode,
        delivery,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string; field?: keyof DeliveryDetails };
    if (res.ok && json.url) return { ok: true, redirectUrl: json.url };
    return { ok: false, message: json.error ?? 'We couldn’t start checkout. Please try again.', field: json.field };
  } catch {
    return { ok: false, message: 'We couldn’t connect. Check your internet and try again.' };
  }
}
