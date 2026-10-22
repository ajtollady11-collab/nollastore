import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Password protection for the orders dashboard (/admin).
 * The password lives ONLY in Vercel: Settings → Environment Variables → ADMIN_PASSWORD.
 * Changing it there (and redeploying) signs everyone out.
 */

export const ADMIN_COOKIE = 'nolla-admin';
const SESSION_DAYS = 30;

const password = () => (process.env.ADMIN_PASSWORD ?? '').trim();
export const adminConfigured = () => password().length > 0;

function sign(value: string): string {
  // Tied to the password and the Square token, so changing either logs everyone out
  const secret = `${password()}|${process.env.SQUARE_ACCESS_TOKEN ?? ''}|nolla-admin`;
  return createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(attempt: string): boolean {
  if (!adminConfigured()) return false;
  // Compare signatures, so the check takes the same time whatever is typed
  return safeEqual(sign(`pw:${attempt.trim()}`), sign(`pw:${password()}`));
}

export function newSessionValue(): { value: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const expires = Date.now() + maxAge * 1000;
  return { value: `${expires}.${sign(`session:${expires}`)}`, maxAge };
}

export function sessionValid(value: string | undefined): boolean {
  if (!value || !adminConfigured()) return false;
  const [expires, sig] = value.split('.');
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(`session:${expires}`));
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}
