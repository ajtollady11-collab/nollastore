'use client';

import { useEffect, useRef } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { ugcVideos } from '@/data/content';

/**
 * "See Nolla in real life": the short customer-style clips from the original site.
 * Silent, looping and inline. Each only plays while it's on screen (saves data and
 * battery) and never autoplays for people who prefer reduced motion.
 */
export function RealLife() {
  if (ugcVideos.length === 0) return null;
  return (
    <section aria-labelledby="real-life-title" className="overflow-hidden py-20 sm:py-28">
      <div className="container-soft flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="eyebrow">Nolla at home</p>
          <h2 id="real-life-title" className="headline mt-4">
            See Nolla in real life.
          </h2>
        </Reveal>
        <Reveal>
          <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-charcoal/65">Unboxed, shaken out, shared and slept under.</p>
        </Reveal>
      </div>

      <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:px-8 lg:mx-auto lg:grid lg:max-w-[1320px] lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-12" aria-label="Videos">
        {ugcVideos.map((v) => (
          <li key={v.src} className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-auto">
            <ClipCard {...v} />
          </li>
        ))}
        <li className="w-1 shrink-0 lg:hidden" aria-hidden />
      </ul>
    </section>
  );
}

function ClipCard({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (video.preload !== 'auto') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <figure>
      <div className="relative aspect-[9/16] overflow-hidden rounded-soft bg-oat-soft">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <a href="#shop" className="mt-3 inline-block text-[0.85rem] text-charcoal/75 underline decoration-charcoal/25 underline-offset-4 hover:text-charcoal">
        Shop the blanket
      </a>
    </figure>
  );
}
