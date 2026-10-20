import { Hero } from '@/components/home/Hero';
import { GiftSection } from '@/components/home/GiftSection';
import { Moments } from '@/components/home/Moments';
import { Benefits } from '@/components/home/Benefits';
import { FabricSection } from '@/components/home/FabricSection';
import { SizeGuideSection } from '@/components/home/SizeGuideSection';
import { Story } from '@/components/home/Story';
import { FAQSection } from '@/components/home/FAQSection';
import { FinalCta } from '@/components/home/FinalCta';
import { SelectionProvider } from '@/components/product/SelectionProvider';
import { PurchaseSection } from '@/components/product/PurchaseSection';
import { StickyPurchaseBar } from '@/components/product/StickyPurchaseBar';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { PRODUCT, SIZES, COLOURS } from '@/data/product';
import { site } from '@/data/site';

/**
 * The homepage is the product page. In order:
 * hero → buy → the free gift → staying in → why it belongs → texture →
 * size guide → our story → reviews (only when genuine) → FAQ → final call.
 */
export default function HomePage() {
  return (
    <SelectionProvider>
      <Hero />
      <PurchaseSection />
      <GiftSection />
      <Moments />
      <Benefits />
      <FabricSection />
      <SizeGuideSection />
      <Story />
      <ReviewSection />
      <FAQSection />
      <FinalCta />
      <StickyPurchaseBar />
      <ProductJsonLd />
    </SelectionProvider>
  );
}

/** Structured data for search engines: UK prices (the storefront that can take payment today). */
function ProductJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: PRODUCT.name.replace('™', ''),
    description: PRODUCT.description,
    brand: { '@type': 'Brand', name: 'nolla' },
    image: [`${site.url}/images/home/hero-nuv-faux-fur-2k.webp`],
    offers: SIZES.flatMap((s) =>
      COLOURS.map((c) => ({
        '@type': 'Offer',
        name: `${c.label} / ${s.label}`,
        price: (s.prices.uk / 100).toFixed(2),
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${site.url}/#shop`,
      })),
    ),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
