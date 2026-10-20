'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Gift, X } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { GIFT, galleryFor, getColour, type ColourId } from '@/data/product';
import { cn } from '@/lib/cn';

/**
 * Swipeable gallery: a scroll-snap track (native swipe on phones, arrows on
 * desktop) with thumbnails underneath and a full-screen viewer.
 * Shows the chosen colour's own photos, then the free pillow.
 */
export function ProductGallery({ colour }: { colour: ColourId }) {
  const images = galleryFor(colour);
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const colourLabel = getColour(colour)?.label ?? '';

  const goTo = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, track.children.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    setIndex(clamped);
  }, []);

  // Keep the active thumbnail in view (horizontal only, never scrolls the page)
  useEffect(() => {
    const row = thumbsRef.current;
    const thumb = row?.children[index] as HTMLElement | undefined;
    if (!row || !thumb) return;
    const left = thumb.offsetLeft - row.clientWidth / 2 + thumb.clientWidth / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [index]);

  // New colour → back to its first photo
  useEffect(() => {
    goTo(0, false);
  }, [colour, goTo]);

  // Follow the swipe
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="min-w-0">
      <div className="group relative overflow-hidden rounded-soft bg-oat-soft">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-roledescription="carousel"
          aria-label={`Photos of the ${colourLabel} blanket`}
        >
          {images.map((img, i) => {
            const isGift = img.src === GIFT.image.src;
            return (
              <div key={img.src} className="relative aspect-[4/5] w-full shrink-0 snap-center snap-always" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
                <button
                  type="button"
                  onClick={() => setViewer(i)}
                  className="absolute inset-0 block h-full w-full cursor-zoom-in"
                  aria-label={`View photo ${i + 1} of ${images.length} full screen`}
                  tabIndex={i === index ? 0 : -1}
                >
                  <SmartImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    className="object-cover"
                  />
                </button>
                {!isGift && i === 0 && (
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-espresso px-3 py-1.5 text-[0.75rem] font-medium text-ivory">
                    <Gift className="h-3.5 w-3.5" aria-hidden />
                    Free cloud pillow included
                  </span>
                )}
                {isGift && (
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-[0.75rem] font-medium text-charcoal">
                    <Gift className="h-3.5 w-3.5 text-mocha" aria-hidden />
                    Included free with every blanket
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Counter + expand hint */}
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ivory/90 px-2.5 py-1 text-[0.72rem] tabular-nums text-charcoal/75">
          {index + 1} / {images.length}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 hidden h-9 w-9 place-items-center rounded-full bg-ivory/90 text-charcoal/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:grid" aria-hidden>
          <Expand className="h-4 w-4" strokeWidth={1.6} />
        </span>

        {/* Arrows (pointer devices) */}
        <GalleryArrow side="left" disabled={index === 0} onClick={() => goTo(index - 1)} />
        <GalleryArrow side="right" disabled={index === images.length - 1} onClick={() => goTo(index + 1)} />
      </div>

      {/* Thumbnails */}
      <ul ref={thumbsRef} className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto px-[3px] py-[3px] sm:gap-2" aria-label="Choose a photo">
        {images.map((img, i) => (
          <li key={img.src} className="w-[17%] shrink-0 sm:w-[13%]">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative block aspect-[4/5] w-full overflow-hidden rounded-soft bg-oat-soft outline-offset-2 transition-[opacity,box-shadow] duration-300',
                i === index ? 'opacity-100 ring-1 ring-charcoal ring-offset-2 ring-offset-cream' : 'opacity-60 hover:opacity-100',
              )}
            >
              <SmartImage src={img.src} alt="" fill sizes="90px" quality={75} className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      {viewer !== null && <Lightbox images={images} start={viewer} onClose={(i) => { setViewer(null); goTo(i, false); }} />}
    </div>
  );
}

function GalleryArrow({ side, disabled, onClick }: { side: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={cn(
        'absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-charcoal transition-opacity duration-300 hover:bg-ivory disabled:opacity-0 md:grid',
        'opacity-0 focus-visible:opacity-100 group-hover:opacity-100',
        side === 'left' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
    </button>
  );
}

/** Full-screen viewer: swipe, arrow keys, Escape to close. Photos are never cropped here. */
function Lightbox({ images, start, onClose }: { images: { src: string; alt: string }[]; start: number; onClose: (index: number) => void }) {
  const [index, setIndex] = useState(start);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const indexRef = useRef(start);
  indexRef.current = index;

  const goTo = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, images.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    setIndex(clamped);
  }, [images.length]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    goTo(start, false);
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(indexRef.current);
      if (e.key === 'ArrowRight') goTo(indexRef.current + 1);
      if (e.key === 'ArrowLeft') goTo(indexRef.current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      opener?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[80] flex animate-fade flex-col bg-ivory">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm tabular-nums text-charcoal/60" aria-live="polite">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose(index)}
          aria-label="Close photo viewer"
          className="grid h-11 w-11 place-items-center rounded-full text-charcoal transition-colors hover:bg-oat-soft"
        >
          <X className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <div ref={trackRef} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto">
          {images.map((img, i) => (
            <div key={img.src} className="relative h-full w-full shrink-0 snap-center snap-always px-2 pb-4 sm:px-16">
              <div className="relative h-full w-full">
                <SmartImage src={img.src} alt={img.alt} fill sizes="100vw" priority={i === start} className="object-contain" />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream text-charcoal transition-opacity hover:bg-oat-soft disabled:opacity-0 sm:grid"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === images.length - 1}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream text-charcoal transition-opacity hover:bg-oat-soft disabled:opacity-0 sm:grid"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </button>
      </div>
    </div>
  );
}
