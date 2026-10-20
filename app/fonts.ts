import localFont from 'next/font/local';

/**
 * Fonts are bundled with the site (no Google Fonts request at build or runtime).
 * Fraunces: a soft, editorial serif. Its SOFT axis rounds the terminals,
 * which is exactly the "pillowy but grown-up" feel the brand needs.
 * DM Sans: clean, friendly, never corporate. Used for UI and body.
 * Both are open-source (SIL Open Font License).
 */
export const serif = localFont({
  src: './fonts/fraunces.woff2',
  variable: '--font-serif',
  weight: '100 900',
  display: 'swap',
});

export const sans = localFont({
  src: './fonts/dm-sans.woff2',
  variable: '--font-sans',
  weight: '100 1000',
  display: 'swap',
});
