import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import { benefits } from '@/data/content';

/** Why the blanket earns its place: one photo, four short reasons, no card grid. */
export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="border-t border-charcoal/10 py-20 sm:py-28">
      <div className="container-soft grid gap-12 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-soft bg-oat-soft">
            <SmartImage src={benefits.image.src} alt={benefits.image.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
          <Reveal>
            <p className="eyebrow">{benefits.eyebrow}</p>
            <h2 id="benefits-title" className="headline mt-4 max-w-[16ch]">
              {benefits.title}
            </h2>
          </Reveal>
          <ol className="mt-10 border-t border-charcoal/10">
            {benefits.items.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 60} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-charcoal/10 py-6 sm:grid-cols-[3.5rem_1fr]">
                <span className="font-serif text-[0.95rem] font-light tabular-nums text-taupe" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-[1.35rem] font-light tracking-[-0.015em]">{b.title}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-[0.95rem] leading-relaxed text-charcoal/65">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
