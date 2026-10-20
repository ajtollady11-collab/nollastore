import type { Metadata } from 'next';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ClearCartOnMount } from '@/components/cart/ClearCartOnMount';
import { GIFT } from '@/data/product';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false } };

/** Square redirects here after a successful payment. */
export default function CheckoutSuccessPage() {
  return (
    <section className="container-soft flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <ClearCartOnMount />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-mocha">Order confirmed</p>
      <h1 className="mt-5 max-w-[14ch] font-serif text-[3rem] font-light leading-[0.95] tracking-[-0.045em] sm:text-display-md">
        Thank you. Time to get cosy.
      </h1>
      <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-charcoal/70">
        Your payment went through and a receipt is on its way to your inbox. We’ll email your tracking details as soon as
        your order ships. Your blanket and pillow may arrive in separate packages.
      </p>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-xs font-medium text-ivory">
        <Gift className="h-3.5 w-3.5" aria-hidden />
        Your free {GIFT.name} is included
      </p>
      <Button href="/" size="lg" className="mt-10">
        Back to nolla
      </Button>
    </section>
  );
}
