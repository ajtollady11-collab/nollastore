import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="container-soft flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-serif text-[3rem] font-light leading-[0.95] tracking-[-0.045em] sm:text-display-md">This page wandered off.</h1>
      <p className="mt-4 text-lg text-charcoal/70">The link may be old, or the page has moved.</p>
      <Button href="/" size="lg" className="mt-8">
        Back to home
      </Button>
    </section>
  );
}
