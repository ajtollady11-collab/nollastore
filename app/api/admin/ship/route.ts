import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { markShipped } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/admin/ship { orderId, carrier?, trackingNumber? } — marks a paid order as shipped in Square */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { orderId?: string; carrier?: string; trackingNumber?: string };
  if (!body.orderId) return NextResponse.json({ error: 'Missing order.' }, { status: 400 });
  try {
    await markShipped(body.orderId, body.carrier?.trim() || undefined, body.trackingNumber?.trim() || undefined);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin] mark shipped failed:', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Couldn’t update the order.' }, { status: 502 });
  }
}
