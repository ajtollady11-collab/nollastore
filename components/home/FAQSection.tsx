import Link from 'next/link';
import { Accordion } from '@/components/ui/Accordion';
import { TM } from '@/components/ui/TM';
import { Reveal } from '@/components/ui/Reveal';
import { faqs } from '@/data/faqs';
import { site } from '@/data/site';

export function FAQSection({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? 'h1' : 'h2';
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 border-t border-charcoal/10 py-20 sm:py-28">
      <div className="container-soft grid gap-10 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <Heading id="faq-title" className="headline mt-4">
            Questions, answered.
          </Heading>
          <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-charcoal/65">
            Can’t find what you need? Email{' '}
            <a href={`mailto:${site.contactEmail}`} className="link text-charcoal">
              {site.contactEmail}
            </a>{' '}
            or see{' '}
            <Link href="/shipping-returns" className="link text-charcoal">
              shipping &amp; returns
            </Link>
            .
          </p>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion
            tone="large"
            defaultOpen={faqs[0].id}
            items={faqs.map((f) => ({ id: f.id, title: <TM>{f.question}</TM>, body: <TM>{f.answer}</TM> }))}
          />
        </div>
      </div>
    </section>
  );
}
