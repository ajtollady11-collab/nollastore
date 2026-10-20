import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { shippingReturns } from '@/data/legal';

export const metadata: Metadata = { title: 'Shipping & Returns' };

export default function Page() {
  return <LegalPage content={shippingReturns} />;
}
