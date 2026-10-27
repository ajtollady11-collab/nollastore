'use client';

import { useSelection } from '@/components/product/SelectionProvider';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import { CLASSIC_COLOURS, CUSTOM_COLOURS, getColour, photoFor } from '@/data/product';
import { fabric } from '@/data/content';
import { cn } from '@/lib/cn';

/**
 * Texture, large. Picking a colour here shows that colour's real close-up
 * and also sets the colour in the purchase panel, so browsing and buying stay in step.
 */
export function FabricSection() {
  const { selection, setColour } = useSelection();
  const colour = getColour(selection.colour)!;
  const texture = photoFor(colour.id, 'texture');
  const draped = photoFor(colour.id, 'draped');

  return (
    <section id="fabric" aria-labelledby="fabric-title" className="scroll-mt-20 bg-espresso py-20 text-ivory sm:py-28">
      <div className="container-soft grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between lg:py-2">
          <Reveal>
            <p className="font-sans text-eyebrow font-medium uppercase text-sand">{fabric.eyebrow}</p>
            <h2
              id="fabric-title"
              className="mt-4 font-serif text-[2.1rem] font-light leading-[1.04] tracking-[-0.03em] text-ivory sm:text-display-sm lg:text-display-md"
            >
              {fabric.title}
            </h2>
            <p className="mt-5 max-w-[36ch] text-[0.98rem] leading-[1.7] text-ivory/70">{fabric.body}</p>
          </Reveal>

          <Reveal className="mt-10 lg:mt-0">
            <fieldset>
              <legend className="text-[0.85rem] text-ivory/60">
                Showing <span className="text-ivory">{colour.label}</span>
              </legend>
              {[CLASSIC_COLOURS, CUSTOM_COLOURS].map((group, gi) => (
                <div key={gi} className={cn('flex flex-wrap gap-2.5', gi === 0 ? 'mt-3' : 'mt-4')}>
                  {group.map((c) => (
                    <label key={c.id} className="grid h-11 w-11 cursor-pointer place-items-center">
                      <input
                        type="radio"
                        name="fabric-colour"
                        value={c.id}
                        checked={c.id === colour.id}
                        onChange={() => setColour(c.id)}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          'block h-10 w-10 rounded-full p-[3px] transition-shadow duration-300',
                          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand',
                          c.id === colour.id
                            ? 'shadow-[inset_0_0_0_1.5px_#FBF9F5]'
                            : 'shadow-[inset_0_0_0_1px_rgba(251,249,245,0.2)] hover:shadow-[inset_0_0_0_1px_rgba(251,249,245,0.6)]',
                        )}
                      >
                        <span className="block h-full w-full rounded-full" style={{ background: c.swatch }} />
                      </span>
                      <span className="sr-only">{c.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </fieldset>
            <a
              href="#shop"
              className="mt-6 inline-block text-[0.9rem] text-ivory underline decoration-ivory/30 underline-offset-[6px] hover:decoration-ivory"
            >
              Shop the {colour.label.toLowerCase()} blanket
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-[1fr_0.62fr] items-end gap-3 sm:gap-4 lg:col-span-7 lg:col-start-6">
          <div className="relative aspect-[3/4] overflow-hidden rounded-soft bg-charcoal">
            <SmartImage
              key={texture.src}
              src={texture.src}
              alt={texture.alt}
              fill
              sizes="(min-width: 1024px) 36vw, 60vw"
              className="animate-fade object-cover"
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-soft bg-charcoal">
            <SmartImage
              key={draped.src}
              src={draped.src}
              alt={draped.alt}
              fill
              sizes="(min-width: 1024px) 22vw, 38vw"
              className="animate-fade object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
