import { announcementItems } from '@/data/site';

/**
 * Sliding announcement bar. The track holds two identical halves and slides
 * exactly -50%, so the loop is seamless. Pure CSS (GPU transform), pauses on
 * hover with a mouse, and stands still for people who prefer reduced motion.
 * Screen readers hear the messages once, not on a loop.
 */
const REPEATS_PER_HALF = 3;

export function AnnouncementBar() {
  const half = Array.from({ length: REPEATS_PER_HALF }, () => announcementItems).flat();
  return (
    <div className="relative overflow-hidden bg-espresso text-ivory" role="region" aria-label="Announcements">
      <p className="sr-only">{announcementItems.join('. ')}.</p>
      <div className="marquee-track flex w-max" aria-hidden>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {half.map((item, i) => (
              <li key={`${copy}-${i}`} className="flex h-9 items-center whitespace-nowrap px-6 text-[0.72rem] tracking-[0.04em] sm:px-8 sm:text-[0.76rem]">
                <span>{item}</span>
                <span className="ml-12 text-ivory/35 sm:ml-16">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
