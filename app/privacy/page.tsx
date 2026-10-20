import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { privacyPolicy } from '@/data/legal';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function Page() {
  return <LegalPage content={privacyPolicy} />;
}
