import type { Metadata } from 'next';
import { adminConfigured, isAdmin } from '@/lib/adminAuth';
import { getPaidOrders, type DashboardOrder } from '@/lib/orders';
import { OrdersDashboard } from './OrdersDashboard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
};

/**
 * /admin — the private orders dashboard. Password: ADMIN_PASSWORD in Vercel.
 * Shows paid website orders from Square, numbered from #1.
 */
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const authed = await isAdmin();

  return (
    // Covers the shop's header and footer: this is a back-office page
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-cream text-charcoal">
      {!adminConfigured() ? (
        <Centered>
          <h1 className="font-serif text-3xl">Orders</h1>
          <p className="mt-4 text-charcoal/70">
            The dashboard isn’t switched on yet. In Vercel, add an environment variable called <code>ADMIN_PASSWORD</code> with your
            password, then redeploy.
          </p>
        </Centered>
      ) : !authed ? (
        <Login error={Boolean(error)} />
      ) : (
        <Authed />
      )}
    </div>
  );
}

async function Authed() {
  let orders: DashboardOrder[] = [];
  let loadError: string | null = null;
  try {
    orders = await getPaidOrders();
  } catch (e) {
    loadError = e instanceof Error ? e.message : 'Couldn’t load orders from Square.';
  }
  return (
    <OrdersDashboard
      orders={orders}
      loadError={loadError}
      sandbox={(process.env.SQUARE_ENVIRONMENT ?? '').trim().toLowerCase() !== 'production'}
    />
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-6 py-16">{children}</div>;
}

function Login({ error }: { error: boolean }) {
  return (
    <Centered>
      <p className="font-serif text-2xl lowercase tracking-[-0.03em]">nolla</p>
      <h1 className="mt-6 font-serif text-3xl">Orders</h1>
      <form action="/api/admin/session" method="post" className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="mt-2 h-12 w-full rounded-soft border border-charcoal/20 bg-ivory px-4 text-base outline-none focus:border-charcoal"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            That password isn’t right.
          </p>
        )}
        <button type="submit" className="h-12 w-full rounded-full bg-charcoal font-medium text-ivory hover:bg-espresso">
          Log in
        </button>
      </form>
    </Centered>
  );
}
