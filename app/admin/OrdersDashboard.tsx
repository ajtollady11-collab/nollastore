'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardOrder } from '@/lib/orders';

type Filter = 'to-ship' | 'shipped' | 'refunded' | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'to-ship', label: 'To ship' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'refunded', label: 'Refunded' },
  { id: 'all', label: 'All' },
];

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount / 100);

const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/London' }).format(new Date(iso));

const fullAddress = (o: DashboardOrder) => [o.customer.name, ...o.customer.addressLines, o.customer.country].filter(Boolean).join('\n');

function toCsv(orders: DashboardOrder[]): string {
  const rows = [
    ['Order', 'Paid', 'Status', 'Name', 'Email', 'Phone', 'Address', 'Country', 'Items', 'Free pillows', 'Total', 'Currency', 'Tracking'],
    ...orders.map((o) => [
      `#${o.number}`,
      when(o.paidAt),
      o.status,
      o.customer.name,
      o.customer.email,
      o.customer.phone,
      o.customer.addressLines.join(', '),
      o.customer.country,
      o.items.map((i) => `${i.quantity} x ${i.colour}${i.supplierColour !== i.colour ? ` (${i.supplierColour})` : ''} ${i.size}`).join('; '),
      String(o.pillows),
      (o.total / 100).toFixed(2),
      o.currency,
      [o.carrier, o.trackingNumber].filter(Boolean).join(' '),
    ]),
  ];
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
}

export function OrdersDashboard({ orders, loadError, sandbox }: { orders: DashboardOrder[]; loadError: string | null; sandbox: boolean }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('to-ship');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const counts = useMemo(
    () => ({
      'to-ship': orders.filter((o) => o.status === 'to-ship').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      refunded: orders.filter((o) => o.status === 'refunded').length,
      all: orders.length,
    }),
    [orders],
  );
  const takings = orders.reduce((s, o) => s + o.total - o.refunded, 0);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, '');
    return orders
      .filter((o) => filter === 'all' || o.status === filter)
      .filter((o) => {
        if (!q) return true;
        const hay = [String(o.number), o.customer.name, o.customer.email, o.customer.phone, ...o.customer.addressLines, o.customer.country]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      })
      // Oldest first when shipping (ship in order), newest first otherwise
      .sort((a, b) => (filter === 'to-ship' ? a.number - b.number : b.number - a.number));
  }, [orders, filter, query]);

  const refresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1200);
  };

  const downloadCsv = () => {
    const blob = new Blob([toCsv(shown)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nolla-orders-${filter}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-serif text-xl lowercase tracking-[-0.03em] text-charcoal/60">nolla</p>
          <h1 className="font-serif text-4xl tracking-[-0.03em]">Orders</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={refresh} className="h-10 rounded-full border border-charcoal/20 px-4 text-sm hover:bg-charcoal/5">
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button onClick={downloadCsv} className="h-10 rounded-full border border-charcoal/20 px-4 text-sm hover:bg-charcoal/5">
            Download CSV
          </button>
          <form action="/api/admin/session" method="post">
            <input type="hidden" name="action" value="logout" />
            <button className="h-10 rounded-full px-4 text-sm text-charcoal/60 underline-offset-4 hover:underline">Log out</button>
          </form>
        </div>
      </header>

      {sandbox && (
        <p className="mt-6 rounded-soft border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Square is in <strong>test mode</strong> (sandbox), so these are test orders, not real ones.
        </p>
      )}
      {loadError && (
        <p role="alert" className="mt-6 rounded-soft border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          Couldn’t load orders from Square: {loadError}
        </p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="To ship" value={String(counts['to-ship'])} strong />
        <Stat label="Shipped" value={String(counts.shipped)} />
        <Stat label="Paid orders" value={String(counts.all)} />
        <Stat label="Takings (after refunds)" value={money(takings, 'GBP')} />
      </dl>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-oat-soft p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm sm:px-4 ${filter === f.id ? 'bg-charcoal text-ivory' : 'text-charcoal/70 hover:text-charcoal'}`}
            >
              {f.label} <span className="opacity-60">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, postcode, #number"
          aria-label="Search orders"
          className="h-10 w-full rounded-full border border-charcoal/20 bg-ivory px-4 text-sm outline-none focus:border-charcoal sm:w-72"
        />
      </div>

      <ul className="mt-6 space-y-4">
        {shown.map((o) => (
          <OrderCard key={o.squareOrderId} order={o} onChanged={() => router.refresh()} />
        ))}
      </ul>
      {shown.length === 0 && !loadError && (
        <p className="mt-10 text-center text-charcoal/60">
          {orders.length === 0 ? 'No paid orders yet. They’ll appear here as soon as someone pays.' : 'Nothing here.'}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-soft border px-4 py-3 ${strong ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/10 bg-ivory'}`}>
      <dt className={`text-xs ${strong ? 'text-ivory/70' : 'text-charcoal/60'}`}>{label}</dt>
      <dd className="mt-1 text-2xl font-medium tabular-nums">{value}</dd>
    </div>
  );
}

const STATUS = {
  'to-ship': { label: 'To ship', className: 'bg-amber-100 text-amber-900' },
  shipped: { label: 'Shipped', className: 'bg-emerald-100 text-emerald-900' },
  refunded: { label: 'Refunded', className: 'bg-charcoal/10 text-charcoal/70' },
} as const;

function OrderCard({ order: o, onChanged }: { order: DashboardOrder; onChanged: () => void }) {
  const [copied, setCopied] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress(o));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the address is still on screen */
    }
  };

  const markShipped = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch('/api/admin/ship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: o.squareOrderId, carrier, trackingNumber: tracking }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (res?.ok) {
      setShipping(false);
      onChanged();
    } else setError(json.error ?? 'Couldn’t update the order. Try again.');
  };

  const status = STATUS[o.status];

  return (
    <li className="rounded-soft border border-charcoal/10 bg-ivory p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <h2 className="font-serif text-3xl tabular-nums">#{o.number}</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
        </div>
        <p className="text-sm text-charcoal/60">Paid {when(o.paidAt)}</p>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-3">
        <section>
          <h3 className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Items</h3>
          <ul className="mt-2 space-y-1.5">
            {o.items.map((i, n) => (
              <li key={n} className="text-[0.95rem]">
                <strong className="font-medium">
                  {i.quantity} × {i.colour}
                </strong>{' '}
                · {i.size}
                {i.supplierColour !== i.colour && <span className="block text-xs text-charcoal/55">CJ colour: {i.supplierColour}</span>}
              </li>
            ))}
            {o.items.length === 0 && <li className="text-sm text-charcoal/60">See the order in Square</li>}
            {o.pillows > 0 && (
              <li className="text-[0.95rem] text-mocha">
                + {o.pillows} × free Nimbus cloud pillow
              </li>
            )}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Ship to</h3>
            <button onClick={copy} className="text-xs text-charcoal/60 underline underline-offset-4 hover:text-charcoal">
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>
          <address className="mt-2 whitespace-pre-line text-[0.95rem] not-italic leading-relaxed">{fullAddress(o) || '—'}</address>
        </section>

        <section>
          <h3 className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Contact</h3>
          <p className="mt-2 break-all text-[0.95rem]">
            {o.customer.email ? <a className="underline underline-offset-4" href={`mailto:${o.customer.email}`}>{o.customer.email}</a> : '—'}
          </p>
          <p className="mt-1 text-[0.95rem]">{o.customer.phone ? <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a> : '—'}</p>
          <h3 className="mt-4 text-xs font-medium uppercase tracking-wider text-charcoal/50">Paid</h3>
          <p className="mt-2 text-[0.95rem] tabular-nums">
            {money(o.total, o.currency)}
            {o.refunded > 0 && <span className="text-charcoal/60"> · refunded {money(o.refunded, o.currency)}</span>}
          </p>
          <p className="text-xs text-charcoal/55">
            {o.delivery}
            {o.discount && ` · ${o.discount}`}
          </p>
          {o.receiptUrl && (
            <a href={o.receiptUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs underline underline-offset-4">
              Square receipt
            </a>
          )}
        </section>
      </div>

      <div className="mt-5 border-t border-charcoal/10 pt-4">
        {o.status === 'shipped' ? (
          <p className="text-sm text-charcoal/70">
            Shipped{o.shippedAt && ` ${when(o.shippedAt)}`}
            {(o.carrier || o.trackingNumber) && ` · ${[o.carrier, o.trackingNumber].filter(Boolean).join(' ')}`}
          </p>
        ) : o.status === 'to-ship' ? (
          shipping ? (
            <div className="flex flex-wrap items-end gap-2">
              <label className="text-sm">
                <span className="block text-xs text-charcoal/60">Courier (optional)</span>
                <input value={carrier} onChange={(e) => setCarrier(e.target.value)} className="mt-1 h-10 w-40 rounded-soft border border-charcoal/20 bg-cream px-3" />
              </label>
              <label className="text-sm">
                <span className="block text-xs text-charcoal/60">Tracking number (optional)</span>
                <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="mt-1 h-10 w-56 rounded-soft border border-charcoal/20 bg-cream px-3" />
              </label>
              <button disabled={busy} onClick={markShipped} className="h-10 rounded-full bg-charcoal px-5 text-sm font-medium text-ivory hover:bg-espresso disabled:opacity-60">
                {busy ? 'Saving…' : 'Confirm shipped'}
              </button>
              <button onClick={() => setShipping(false)} className="h-10 px-3 text-sm text-charcoal/60">
                Cancel
              </button>
            </div>
          ) : o.canMarkShipped ? (
            <button onClick={() => setShipping(true)} className="h-10 rounded-full bg-charcoal px-5 text-sm font-medium text-ivory hover:bg-espresso">
              Mark as shipped
            </button>
          ) : (
            <p className="text-sm text-charcoal/60">Mark this one as shipped in the Square app.</p>
          )
        ) : null}
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
