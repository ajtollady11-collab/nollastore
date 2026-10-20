import { NextResponse, type NextRequest } from 'next/server';

/**
 * Picks a visitor's currency from their country, so they don't have to.
 * Vercel adds the visitor's country to every request (x-vercel-ip-country).
 * We store the matching currency in a small cookie; the site uses it unless
 * the visitor has already chosen a currency themselves (their choice always wins).
 * Countries we don't ship to see pounds (GBP).
 */

// Countries we ship to (data/countries.ts) → their currency. Everyone else sees pounds.
const COUNTRY_CURRENCY: Record<string, string> = {
  GB: 'GBP', US: 'USD', CA: 'CAD', MX: 'MXN', AU: 'AUD', NZ: 'NZD',
  FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', PT: 'EUR', NL: 'EUR', FI: 'EUR',
  SE: 'SEK', NO: 'NOK',
};

export const GEO_COOKIE = 'nolla-geo-currency';

export function middleware(req: NextRequest) {
  const country = (req.headers.get('x-vercel-ip-country') ?? '').toUpperCase();
  const currency = COUNTRY_CURRENCY[country] ?? 'GBP';
  const res = NextResponse.next();
  if (req.cookies.get(GEO_COOKIE)?.value !== currency) {
    res.cookies.set(GEO_COOKIE, currency, { path: '/', maxAge: 60 * 60 * 24, sameSite: 'lax' });
  }
  return res;
}

// Pages only (not images, fonts, videos or the checkout API)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|videos|icon.svg|favicon.ico).*)'],
};
