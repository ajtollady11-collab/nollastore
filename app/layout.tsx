import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { serif, sans } from './fonts';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { FunTimer } from '@/components/layout/FunTimer';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RegionProvider } from '@/components/store/RegionProvider';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { site } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `nolla | ${site.tagline}`,
    template: '%s | nolla',
  },
  description: site.description,
  openGraph: {
    title: 'nolla | make staying in feel better.',
    description: site.description,
    siteName: 'nolla',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/images/home/hero-nuv-faux-fur-2k.webp', width: 2752, height: 1536, alt: 'A woman wrapped in the white Nolla Nuv blanket in a sunny armchair.' }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#F7F3EC',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <RegionProvider>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-ivory"
            >
              Skip to content
            </a>
            <AnnouncementBar />
            <FunTimer />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </RegionProvider>
      </body>
    </html>
  );
}
