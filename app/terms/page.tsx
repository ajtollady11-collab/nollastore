import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { termsAndConditions } from '@/data/legal';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function Page() {
  return <LegalPage content={termsAndConditions} />;
}
