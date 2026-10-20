import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import { story } from '@/data/content';

/** Short brand story. No invented history: just why Nolla exists. */
export function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="scroll-mt-20 bg-oat-soft py-20 sm:py-28">
      <div className="container-soft grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-6 lg:col-start-1">
          <p className="eyebrow">{story.eyebrow}</p>
          <h2 id="story-title" className="headline mt-4 max-w-[15ch]">
            {story.title}
          </h2>
          <div className="mt-6 max-w-[46ch] space-y-4 text-[1.02rem] leading-[1.75] text-charcoal/70">
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 font-serif text-[1.6rem] font-light italic tracking-[-0.02em] text-mocha">{story.signoff}</p>
          <p className="mt-2 font-serif text-[1.1rem] lowercase tracking-[-0.03em] text-charcoal/60">— nolla</p>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-soft bg-oat lg:max-w-none">
            <SmartImage src={story.image.src} alt={story.image.alt} fill sizes="(min-width: 1024px) 38vw, 90vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
