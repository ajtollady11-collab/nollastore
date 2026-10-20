import { Check } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { TM } from '@/components/ui/TM';
import { Reveal } from '@/components/ui/Reveal';
import { giftSection } from '@/data/content';
import { photoFor } from '@/data/product';

/**
 * The free pillow gets its own moment: the pillow, a corner of the blanket
 * it comes with, and three plain facts about how the gift works.
 */
export function GiftSection() {
  const blanket = photoFor('white', 'texture');
  return (
    <section id="gift" aria-labelledby="gift-title" className="scroll-mt-20 bg-ivory py-20 sm:py-28">
      <div className="container-soft grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
        <Reveal className="relative">
          <div className="grid grid-cols-[1.35fr_1fr] items-end gap-3 sm:gap-4">
            <div className="relative aspect-square overflow-hidden rounded-soft bg-oat">
              <SmartImage src={giftSection.image.src} alt={giftSection.image.alt} fill sizes="(min-width: 1024px) 32vw, 58vw" className="object-cover" />
            </div>
            <div className="relative mb-10 aspect-[3/4] overflow-hidden rounded-soft bg-oat sm:mb-16">
              <SmartImage src={blanket.src} alt={blanket.alt} fill sizes="(min-width: 1024px) 22vw, 40vw" className="object-cover" />
            </div>
          </div>
          <p className="mt-4 font-serif text-[1.05rem] font-light italic text-charcoal/60">One blanket, one little cloud.</p>
        </Reveal>

        <Reveal>
          <p className="eyebrow">{giftSection.eyebrow}</p>
          <h2 id="gift-title" className="headline mt-4">
            {giftSection.title}
          </h2>
          <p className="prose-soft mt-5 max-w-[40ch]">
            <TM>{giftSection.body}</TM>
          </p>
          <ul className="mt-8 space-y-3.5">
            {giftSection.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.95rem] text-charcoal/80">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-oat text-mocha">
                  <Check className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Button href="#shop" variant="secondary" size="lg" className="mt-10">
            Choose your blanket
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
