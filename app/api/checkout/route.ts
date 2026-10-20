import { NextResponse, type NextRequest } from 'next/server';
import { priceOrder, validateDelivery, type DeliveryDetails, type OrderInputLine } from '@/lib/order';
import { createPaymentLink, squareConfigured } from '@/lib/square';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout
 * Body: { region, lines: [{ selection: { colour, size }, quantity }], shippingMethod, discountCode?, delivery }
 * Re-prices everything server-side, validates the delivery details
 * (and that the delivery option matches the country), then creates a
 * Square payment page and returns { url }.
 */
export async function POST(req: NextRequest) {
  if (!squareConfigured()) {
    return NextResponse.json({ error: 'Checkout isn’t connected yet. Please try again soon.' }, { status: 503 });
  }

  let body: { lines?: OrderInputLine[]; shippingMethod?: string; discountCode?: string | null; delivery?: Partial<DeliveryDetails>; region?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 400 });
  }

  const delivery = validateDelivery(body.delivery, body.shippingMethod ?? '');
  if (!delivery.ok) return NextResponse.json({ error: delivery.error, field: delivery.field }, { status: 400 });

  const priced = priceOrder(body.lines ?? [], body.shippingMethod ?? '', body.discountCode, body.region);
  if (!priced.ok) return NextResponse.json({ error: priced.error }, { status: 400 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || req.nextUrl.origin;
  const result = await createPaymentLink(priced.order, delivery.delivery, {
    redirectUrl: `${origin}/checkout/success`,
    supportEmail: process.env.SUPPORT_EMAIL || undefined,
  });

  if (!result.ok) {
    console.error('[checkout] Square error:', result.status, result.detail);
    return NextResponse.json({ error: 'We couldn’t start checkout. Please try again in a moment.' }, { status: 502 });
  }
  return NextResponse.json({ url: result.url });
}
