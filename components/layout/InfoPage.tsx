import { Button } from '@/components/ui/Button';

/** Simple layout for short information pages (e.g. Contact). */
export function InfoPage({ title, intro, children }: { title: string; intro: string; children?: React.ReactNode }) {
  return (
    <section className="container-soft pb-24 pt-8 sm:pt-14">
      <div className="max-w-2xl">
        <h1 className="font-serif text-[3rem] font-light leading-[0.95] tracking-[-0.045em] sm:text-display-md">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-charcoal/70">{intro}</p>
        <div className="mt-10 rounded-soft border border-charcoal/10 bg-ivory p-7 text-[0.95rem] leading-relaxed text-charcoal/70 sm:p-9">
          {children}
        </div>
        <Button href="/" variant="ghost" className="mt-8">
          Back to home
        </Button>
      </div>
    </section>
  );
}
