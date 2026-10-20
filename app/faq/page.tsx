import type { Metadata } from 'next';
import { FAQSection } from '@/components/home/FAQSection';
import { FinalCta } from '@/components/home/FinalCta';

export const metadata: Metadata = { title: 'FAQ' };

export default function FAQPage() {
  return (
    <>
      <FAQSection asPage />
      <FinalCta />
    </>
  );
}
