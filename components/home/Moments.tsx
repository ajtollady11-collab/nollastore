import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/ui/Reveal';
import { moments } from '@/data/content';
import { cn } from '@/lib/cn';

/**
 * "Staying in" told through the photography. Desktop: an asymmetric editorial
 * spread. Phones: a swipeable row of tall photos, the way people already
 * scroll on Instagram and TikTok.
 */
export function Moments() {
  const [mornings, films, nights] = moments;
  return (
    <section aria-labelledby="moments-title" className="py-20 sm:py-28">
      <div className="container-soft">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Staying in</p>
            <h2 id="moments-title" className="headline mt-4 max-w-[14ch]">
              Something to look forward to.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <p className="prose-soft max-w-[40ch]">
              The best evenings don’t need a plan. A blanket you love turns an ordinary night in into the part of the day you were waiting for.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Phones: swipe */}
      <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:px-8 lg:hidden" aria-label="Moments">
        {moments.map((m) => (
          <li key={m.title} className="w-[78%] shrink-0 snap-start sm:w-[46%]">
            <MomentCard {...m} aspect="aspect-[4/5]" sizes="80vw" />
          </li>
        ))}
        <li className="w-1 shrink-0" aria-hidden />
      </ul>

      {/* Desktop: editorial spread */}
      <div className="container-soft mt-14 hidden grid-cols-12 gap-6 lg:grid">
        <Reveal className="col-span-7">
          <MomentCard {...films} aspect="aspect-[4/5]" sizes="56vw" />
        </Reveal>
        <div className="col-span-5 flex flex-col justify-between gap-6">
          <Reveal className="w-[82%] self-end">
            <MomentCard {...mornings} aspect="aspect-[4/5]" sizes="32vw" />
          </Reveal>
          <Reveal className="w-[70%]" delay={120}>
            <MomentCard {...nights} aspect="aspect-[3/4]" sizes="28vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MomentCard({ title, body, image, aspect, sizes }: (typeof moments)[number] & { aspect: string; sizes: string }) {
  return (
    <figure>
      <div className={cn('relative w-full overflow-hidden rounded-soft bg-oat-soft', aspect)}>
        <SmartImage src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover transition-transform duration-[1.6s] ease-soft hover:scale-[1.02]" />
      </div>
      <figcaption className="mt-3.5 flex items-baseline justify-between gap-4">
        <span className="font-serif text-[1.3rem] font-light tracking-[-0.015em]">{title}</span>
        <span className="text-right text-[0.85rem] text-charcoal/55">{body}</span>
      </figcaption>
    </figure>
  );
}
