import type { Metadata } from 'next';
import { GiftSection } from '@/components/home/GiftSection';
import { RealLife } from '@/components/home/RealLife';
import { FabricSection } from '@/components/home/FabricSection';
import { SizeGuideSection } from '@/components/home/SizeGuideSection';
import { FAQSection } from '@/components/home/FAQSection';
import { SelectionProvider } from '@/components/product/SelectionProvider';
import { PurchaseSection } from '@/components/product/PurchaseSection';
import { StickyPurchaseBar } from '@/components/product/StickyPurchaseBar';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { PRODUCT, COLOURS, sizeDisplay, sizesFor } from '@/data/product';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: PRODUCT.shortName,
  description: PRODUCT.description,
  alternates: { canonical: '/shop' },
};

/**
 * The product page. In order:
 * buy → the free gift → real-life videos → reviews → texture → size guide → FAQ.
 */
export default function ShopPage() {
  return (
    <SelectionProvider>
      <h1 className="sr-only">{PRODUCT.name}</h1>
      <PurchaseSection />
      <GiftSection />
      <RealLife />
      <ReviewSection />
      <FabricSection />
      <SizeGuideSection />
      <FAQSection />
      <StickyPurchaseBar />
      <ProductJsonLd />
    </SelectionProvider>
  );
}

function ProductJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: PRODUCT.name.replace('™', ''),
    description: PRODUCT.description,
    brand: { '@type': 'Brand', name: 'nolla' },
    image: [`${site.url}/images/home/hero-nuv-faux-fur-2k.webp`],
    offers: COLOURS.flatMap((c) =>
      sizesFor(c.collection).map((s) => ({
        '@type': 'Offer',
        name: `${c.label} / ${sizeDisplay(s)}`,
        price: (s.prices.GBP / 100).toFixed(2),
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${site.url}/shop`,
      })),
    ),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
