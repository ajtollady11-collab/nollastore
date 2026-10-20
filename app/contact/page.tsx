import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Contact' };

export default function Page() {
  return (
    <InfoPage title="Say hello." intro="Questions about an order, a product or anything else? We’re happy to help.">
      <p>
        Email us at{' '}
        <a href={`mailto:${site.contactEmail}`} className="font-medium text-charcoal underline decoration-charcoal/25 underline-offset-4 hover:decoration-charcoal">
          {site.contactEmail}
        </a>
        .
      </p>
      <p className="mt-4">For orders, include your name and the email you used at checkout so we can find it quickly.</p>
    </InfoPage>
  );
}
