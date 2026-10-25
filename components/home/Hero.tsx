import { ArrowRight, Gift } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { TM } from '@/components/ui/TM';
import { TrustRow } from './TrustRow';
import { hero } from '@/data/content';

/**
 * Full-bleed lifestyle hero. On wide screens the copy sits on the quiet wall
 * to the left of the photo; on phones the photo is cropped to the subject and
 * the copy follows underneath, so nothing is ever printed over her face.
 */
export function Hero() {
  return (
    <section className="relative" aria-label="Introduction">
      {/* Phone / tablet */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-oat-soft sm:aspect-[16/11]">
          <SmartImage src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover object-[76%_50%] sm:object-[70%_50%]" />
        </div>
        <div className="container-soft pb-12 pt-8 sm:pt-10">
          <HeroCopy />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden h-[min(calc(100svh-6.5rem),820px)] min-h-[600px] overflow-hidden bg-oat-soft lg:block">
        <SmartImage src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover object-[60%_50%]" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-cream/70 via-cream/35 to-transparent" aria-hidden />
        <div className="container-soft relative flex h-full items-center">
          <div className="max-w-[34rem] animate-rise">
            <HeroCopy desktop />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCopy({ desktop }: { desktop?: boolean }) {
  return (
    <>
      <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-espresso px-3.5 py-1.5 text-[0.78rem] font-medium text-ivory">
        <Gift className="h-3.5 w-3.5" aria-hidden />
        Free cloud pillow with every blanket
      </p>
      <p className="eyebrow">
        <TM>{hero.eyebrow}</TM>
      </p>
      <h1 className="mt-4 font-serif text-[2.75rem] font-light leading-[0.98] tracking-[-0.035em] sm:text-display-lg xl:text-display-xl">
        {hero.title}
      </h1>
      <p className="mt-5 max-w-[34ch] text-[1.02rem] leading-relaxed text-charcoal/75 sm:text-[1.08rem]">{hero.body}</p>
      <div className="mt-8 flex flex-col items-start gap-6">
        <Button href="/shop" size="lg" className="w-full sm:w-auto">
          {hero.cta}
          <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden />
        </Button>
        <TrustRow />
      </div>
    </>
  );
}
