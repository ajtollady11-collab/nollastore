import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, newSessionValue, passwordMatches } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/admin/session — log in (password) or log out (action=logout) of the orders dashboard */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const back = (query = '') => NextResponse.redirect(new URL(`/admin${query}`, req.url), 303);

  if (form?.get('action') === 'logout') {
    const res = back();
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }

  const attempt = String(form?.get('password') ?? '');
  if (!passwordMatches(attempt)) {
    // Slow down guessing
    await new Promise((r) => setTimeout(r, 1000));
    return back('?error=1');
  }

  const res = back();
  const { value, maxAge } = newSessionValue();
  res.cookies.set(ADMIN_COOKIE, value, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge });
  return res;
}
