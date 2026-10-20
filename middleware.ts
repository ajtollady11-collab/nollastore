import { NextResponse, type NextRequest } from 'next/server';

/**
 * Picks a visitor's currency from their country, so they don't have to.
 * Vercel adds the visitor's country to every request (x-vercel-ip-country).
 * We store the matching currency in a small cookie; the site uses it unless
 * the visitor has already chosen a currency themselves (their choice always wins).
 * Countries not listed here see pounds (GBP).
 */

const EURO = ['AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES', 'AD', 'MC', 'SM', 'VA', 'ME', 'XK'];

const COUNTRY_CURRENCY: Record<string, string> = {
  ...Object.fromEntries(EURO.map((c) => [c, 'EUR'])),
  GB: 'GBP', IM: 'GBP', JE: 'GBP', GG: 'GBP', GI: 'GBP',
  US: 'USD', PR: 'USD',
  CA: 'CAD', AU: 'AUD', NZ: 'NZD', CH: 'CHF', LI: 'CHF',
  SE: 'SEK', NO: 'NOK', DK: 'DKK', GL: 'DKK', FO: 'DKK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', IS: 'ISK', TR: 'TRY',
  JP: 'JPY', CN: 'CNY', HK: 'HKD', SG: 'SGD', KR: 'KRW', IN: 'INR',
  ID: 'IDR', MY: 'MYR', PH: 'PHP', TH: 'THB', IL: 'ILS', MX: 'MXN', BR: 'BRL', ZA: 'ZAR',
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
