import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { finalCta } from '@/data/content';

/** Closing image and one clear way back to the purchase section. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-espresso" data-sticky-stop>
      <div className="relative h-[78svh] min-h-[520px] max-h-[820px]">
        <SmartImage src={finalCta.image.src} alt={finalCta.image.alt} fill sizes="100vw" className="object-cover object-[68%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-espresso/0 sm:bg-gradient-to-r sm:from-espresso/75 sm:via-espresso/25 sm:to-transparent" aria-hidden />
        <div className="container-soft relative flex h-full items-end pb-14 sm:items-center sm:pb-0">
          <div className="max-w-[28rem] text-ivory">
            <h2 id="final-cta-title" className="font-serif text-[2.4rem] font-light leading-[1.02] tracking-[-0.035em] sm:text-display-md">
              {finalCta.title}
            </h2>
            <p className="mt-5 max-w-[34ch] text-[1.02rem] leading-relaxed text-ivory/80">{finalCta.body}</p>
            <Button href="/shop" variant="light" size="lg" className="mt-8">
              {finalCta.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
