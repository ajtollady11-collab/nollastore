import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <section className="container-soft pb-24 pt-6 sm:pt-12">
      <CheckoutForm />
    </section>
  );
}
