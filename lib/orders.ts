import 'server-only';
import { randomUUID } from 'node:crypto';
import { COLOURS, PRODUCT, SIZES, sizeDisplay } from '@/data/product';
import { countryName } from '@/data/countries';

/**
 * Reads PAID website orders from Square for the orders dashboard (/admin).
 * Only orders with a completed payment are included: someone who opens the
 * Square payment page but never pays never shows up.
 * Orders are numbered 1, 2, 3… in the order they were paid.
 */

const SQUARE_VERSION = '2024-01-18';
/** Orders paid before this date are ignored (keeps the numbering stable) */
const FIRST_ORDER_DATE = '2026-01-01T00:00:00Z';

const env = (key: string) => (process.env[key] ?? '').trim();
const isProduction = () => env('SQUARE_ENVIRONMENT').toLowerCase() === 'production';
const apiBase = () =>
  env('SQUARE_API_BASE_URL').replace(/\/$/, '') || (isProduction() ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com');

async function square<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${env('SQUARE_ACCESS_TOKEN')}`,
      'Square-Version': SQUARE_VERSION,
      'Content-Type': 'application/json',
    },
    ...(init?.body !== undefined && { body: JSON.stringify(init.body) }),
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => ({}))) as T & { errors?: { code?: string; detail?: string }[] };
  if (!res.ok) {
    const detail = json.errors?.map((e) => e.detail || e.code).join('; ') || `HTTP ${res.status}`;
    throw new Error(`Square: ${detail}`);
  }
  return json;
}

/* ─────────────── Square shapes (only the fields we use) ─────────────── */

type Money = { amount?: number; currency?: string };
type SqPayment = {
  id: string;
  created_at: string;
  status: string;
  order_id?: string;
  note?: string;
  total_money?: Money;
  amount_money?: Money;
  refunded_money?: Money;
  buyer_email_address?: string;
  receipt_url?: string;
  receipt_number?: string;
};
type SqAddress = {
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  administrative_district_level_1?: string;
  postal_code?: string;
  country?: string;
};
type SqFulfillment = {
  uid?: string;
  type?: string;
  state?: string;
  shipment_details?: {
    recipient?: { display_name?: string; email_address?: string; phone_number?: string; address?: SqAddress };
    carrier?: string;
    tracking_number?: string;
    shipped_at?: string;
  };
};
type SqOrder = {
  id: string;
  version?: number;
  state?: string;
  line_items?: { name?: string; quantity?: string; base_price_money?: Money; total_money?: Money }[];
  service_charges?: { name?: string; amount_money?: Money }[];
  discounts?: { name?: string }[];
  fulfillments?: SqFulfillment[];
  total_money?: Money;
};

/* ─────────────── What the dashboard shows ─────────────── */

export type OrderItem = {
  colour: string;
  /** Supplier colour name, for ordering from CJ */
  supplierColour: string;
  size: string;
  quantity: number;
  price: number;
};

export type DashboardOrder = {
  number: number;
  squareOrderId: string;
  paymentId: string;
  paidAt: string;
  status: 'to-ship' | 'shipped' | 'refunded';
  customer: {
    name: string;
    email: string;
    phone: string;
    addressLines: string[];
    country: string;
    countryCode: string;
  };
  items: OrderItem[];
  pillows: number;
  delivery: string;
  discount: string | null;
  total: number;
  refunded: number;
  currency: string;
  carrier: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  receiptUrl: string | null;
  canMarkShipped: boolean;
};

/** "Nolla Nuv™ Velvet Blanket (Pink (Powder Pink) / 150 × 200 cm)" → colour + size */
function parseBlanket(name: string): Pick<OrderItem, 'colour' | 'supplierColour' | 'size'> | null {
  if (!name.startsWith(PRODUCT.name)) return null;
  const inner = name.slice(PRODUCT.name.length).trim().replace(/^\(/, '').replace(/\)$/, '');
  const slash = inner.lastIndexOf(' / ');
  const colourPart = slash >= 0 ? inner.slice(0, slash).trim() : inner;
  const sizePart = slash >= 0 ? inner.slice(slash + 3).trim() : '';
  const colour = COLOURS.find((c) => colourPart === c.label || colourPart.startsWith(`${c.label} (`));
  // "Large (150 × 200 cm)" (older orders just say "150 × 200 cm")
  const size = SIZES.find((s) => sizeDisplay(s) === sizePart || s.label === sizePart);
  return {
    colour: colour?.label ?? colourPart,
    supplierColour: colour?.supplierName ?? colourPart,
    size: size ? sizeDisplay(size) : sizePart,
  };
}

/** Fallback when Square dropped the delivery block: parse our payment note ("SHIP TO: name, address | phone | email | method") */
function parseNote(note: string | undefined) {
  const m = note?.match(/SHIP TO:\s*([^|]+)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)/);
  if (!m) return null;
  const [name, ...address] = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  return { name: name ?? '', address, phone: m[2].trim(), email: m[3].trim(), delivery: m[4].trim() };
}

function isWebsiteOrder(order: SqOrder | undefined, payment: SqPayment): boolean {
  if (payment.note?.startsWith('SHIP TO:')) return true;
  return Boolean(order?.line_items?.some((l) => (l.name ?? '').startsWith(PRODUCT.name)));
}

async function listCompletedPayments(): Promise<SqPayment[]> {
  const out: SqPayment[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 50; page++) {
    const q = new URLSearchParams({
      location_id: env('SQUARE_LOCATION_ID'),
      begin_time: FIRST_ORDER_DATE,
      sort_order: 'ASC',
      limit: '100',
      ...(cursor && { cursor }),
    });
    const res = await square<{ payments?: SqPayment[]; cursor?: string }>(`/v2/payments?${q}`);
    out.push(...(res.payments ?? []).filter((p) => p.status === 'COMPLETED' && p.order_id));
    cursor = res.cursor;
    if (!cursor) break;
  }
  return out;
}

async function retrieveOrders(ids: string[]): Promise<Map<string, SqOrder>> {
  const map = new Map<string, SqOrder>();
  for (let i = 0; i < ids.length; i += 100) {
    const res = await square<{ orders?: SqOrder[] }>('/v2/orders/batch-retrieve', {
      method: 'POST',
      body: { location_id: env('SQUARE_LOCATION_ID'), order_ids: ids.slice(i, i + 100) },
    });
    for (const o of res.orders ?? []) map.set(o.id, o);
  }
  return map;
}

export async function getPaidOrders(): Promise<DashboardOrder[]> {
  const payments = await listCompletedPayments();
  // One entry per order (the first payment that completed it)
  const firstPayment = new Map<string, SqPayment>();
  for (const p of payments) if (!firstPayment.has(p.order_id!)) firstPayment.set(p.order_id!, p);
  const orders = await retrieveOrders([...firstPayment.keys()]);

  const result: DashboardOrder[] = [];
  for (const [orderId, payment] of firstPayment) {
    const order = orders.get(orderId);
    if (!isWebsiteOrder(order, payment)) continue;

    const items: OrderItem[] = [];
    let pillows = 0;
    for (const l of order?.line_items ?? []) {
      const name = l.name ?? '';
      const qty = Number(l.quantity ?? 1);
      if (name.startsWith('FREE GIFT')) {
        pillows += qty;
        continue;
      }
      const blanket = parseBlanket(name);
      if (blanket) items.push({ ...blanket, quantity: qty, price: l.base_price_money?.amount ?? 0 });
    }
    // Pillow line dropped by Square? The note says how many were promised
    const notePillows = payment.note?.match(/FREE Nimbus cloud pillow x(\d+)/);
    if (!pillows && notePillows) pillows = Number(notePillows[1]);

    const fulfillment = order?.fulfillments?.find((f) => f.type === 'SHIPMENT') ?? order?.fulfillments?.[0];
    const r = fulfillment?.shipment_details?.recipient;
    const note = parseNote(payment.note);
    const a = r?.address;
    const countryCode = a?.country ?? '';
    const addressLines = a
      ? [a.address_line_1, a.address_line_2, a.locality, a.administrative_district_level_1, a.postal_code].filter((x): x is string => Boolean(x))
      : note?.address ?? [];
    const country = countryCode ? countryName(countryCode) : '';

    const refunded = payment.refunded_money?.amount ?? 0;
    const total = payment.total_money?.amount ?? payment.amount_money?.amount ?? order?.total_money?.amount ?? 0;
    const shipped = fulfillment?.state === 'COMPLETED';

    result.push({
      number: 0,
      squareOrderId: orderId,
      paymentId: payment.id,
      paidAt: payment.created_at,
      status: refunded > 0 && refunded >= total ? 'refunded' : shipped ? 'shipped' : 'to-ship',
      customer: {
        name: r?.display_name ?? note?.name ?? '',
        email: r?.email_address ?? note?.email ?? payment.buyer_email_address ?? '',
        phone: r?.phone_number ?? note?.phone ?? '',
        addressLines,
        country,
        countryCode,
      },
      items,
      pillows,
      delivery: order?.service_charges?.[0]?.name ?? note?.delivery ?? 'Free shipping',
      discount: order?.discounts?.[0]?.name ?? null,
      total,
      refunded,
      currency: payment.total_money?.currency ?? 'GBP',
      carrier: fulfillment?.shipment_details?.carrier ?? null,
      trackingNumber: fulfillment?.shipment_details?.tracking_number ?? null,
      shippedAt: fulfillment?.shipment_details?.shipped_at ?? null,
      receiptUrl: payment.receipt_url ?? null,
      canMarkShipped: Boolean(fulfillment?.uid) && !shipped && !['CANCELED', 'FAILED'].includes(fulfillment?.state ?? ''),
    });
  }

  // Numbered in the order they were paid: the first paid order is #1
  result.sort((x, y) => x.paidAt.localeCompare(y.paidAt));
  result.forEach((o, i) => (o.number = i + 1));
  return result;
}

/**
 * Marks an order as shipped in Square (fulfilment → COMPLETED), with an optional
 * carrier and tracking number. If Square won't jump straight to COMPLETED,
 * it steps through RESERVED and PREPARED first.
 */
export async function markShipped(orderId: string, carrier?: string, trackingNumber?: string): Promise<void> {
  const load = async () => {
    const { order } = await square<{ order: SqOrder }>(`/v2/orders/${encodeURIComponent(orderId)}`);
    const f = order.fulfillments?.find((x) => x.type === 'SHIPMENT') ?? order.fulfillments?.[0];
    if (!f?.uid) throw new Error('This order has no delivery details in Square, so it can’t be marked as shipped here. Mark it in the Square app instead.');
    return { order, f };
  };
  const update = async (state: string, withTracking: boolean) => {
    const { order, f } = await load();
    if (f.state === 'COMPLETED') return;
    await square(`/v2/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      body: {
        idempotency_key: randomUUID(),
        order: {
          version: order.version,
          fulfillments: [
            {
              uid: f.uid,
              state,
              ...(withTracking && {
                shipment_details: {
                  ...(carrier && { carrier: carrier.slice(0, 50) }),
                  ...(trackingNumber && { tracking_number: trackingNumber.slice(0, 100) }),
                  shipped_at: new Date().toISOString(),
                },
              }),
            },
          ],
        },
      },
    });
  };

  try {
    await update('COMPLETED', true);
  } catch {
    // Step through the states Square may require, one at a time
    const { f } = await load();
    const steps = ['RESERVED', 'PREPARED'];
    for (const s of steps.slice(Math.max(0, steps.indexOf(f.state ?? '') + 1))) await update(s, false);
    await update('COMPLETED', true);
  }
}
