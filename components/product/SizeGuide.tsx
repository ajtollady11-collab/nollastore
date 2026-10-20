'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SIZES, type SizeId } from '@/data/product';
import { cn } from '@/lib/cn';

/**
 * To-scale comparison of the three sizes: each outline is drawn from the
 * same corner, so the difference in coverage is easy to see at a glance.
 */
export function SizeGuide({ highlight, onPick, compact }: { highlight?: SizeId; onPick?: (s: SizeId) => void; compact?: boolean }) {
  const max = SIZES[SIZES.length - 1];
  const W = 240;
  const scale = W / max.widthCm;
  const H = max.lengthCm * scale;
  const pad = 2;

  return (
    <div className={cn('grid items-center gap-8', compact ? 'sm:grid-cols-[200px_1fr]' : 'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14')}>
      <figure className={cn('mx-auto w-full', compact ? 'max-w-[220px]' : 'max-w-[340px]')}>
        <svg viewBox={`0 0 ${W + pad * 2} ${H + pad * 2}`} className="h-auto w-full" role="img" aria-label="The three blanket sizes drawn to scale, overlapping from one corner.">
          {[...SIZES].reverse().map((s, i) => {
            const w = s.widthCm * scale;
            const h = s.lengthCm * scale;
            const active = highlight ? s.id === highlight : i === 0;
            return (
              <g key={s.id}>
                <rect
                  x={pad}
                  y={pad + (H - h)}
                  width={w}
                  height={h}
                  rx={2}
                  className={cn('transition-[fill,stroke] duration-500', active ? 'fill-oat stroke-charcoal' : 'fill-ivory/70 stroke-charcoal/30')}
                  strokeWidth={active ? 1.2 : 0.8}
                  strokeDasharray={active ? undefined : '3 3'}
                />
                <text x={pad + w - 6} y={pad + (H - h) + 16} textAnchor="end" className={cn('font-sans text-[11px]', active ? 'fill-charcoal' : 'fill-charcoal/55')}>
                  {s.widthCm} × {s.lengthCm}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-3 text-center text-[0.75rem] text-charcoal/50">Drawn to scale, in centimetres.</figcaption>
      </figure>

      <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
        {SIZES.map((s) => {
          const active = s.id === highlight;
          const Row = onPick ? 'button' : 'div';
          return (
            <li key={s.id}>
              <Row
                {...(onPick ? { type: 'button' as const, onClick: () => onPick(s.id), 'aria-pressed': active } : {})}
                className={cn('block w-full py-4 text-left', onPick && 'group')}
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className={cn('font-serif text-[1.3rem] font-light tracking-[-0.01em] tabular-nums', onPick && 'group-hover:text-mocha')}>{s.label}</span>
                  {s.badge && <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-mocha">{s.badge}</span>}
                </span>
                <span className="mt-1 block text-[0.9rem] leading-relaxed text-charcoal/65">
                  {s.guide}
                  {s.weight && <span className="text-charcoal/45"> Weighs {s.weight}.</span>}
                </span>
                {onPick && <span className="mt-2 inline-block text-[0.8rem] text-charcoal/60 underline decoration-charcoal/20 underline-offset-4">{active ? 'Selected' : 'Choose this size'}</span>}
              </Row>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const SIZE_GUIDE_NOTE =
  'Measurements are approximate. Beds and sofas vary, so measure yours and compare: we don’t promise a particular size fits a particular bed.';

/** The size guide in a dialog, opened from the purchase panel so nobody loses their place. */
export function SizeGuideDialog({ open, onClose, highlight, onPick }: { open: boolean; onClose: () => void; highlight: SizeId; onPick: (s: SizeId) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
      <div className="absolute inset-0 animate-fade bg-charcoal/30" onClick={onClose} />
      <div className="relative max-h-[92dvh] w-full max-w-2xl animate-rise overflow-y-auto bg-cream px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:rounded-soft sm:px-9 sm:pb-9 sm:pt-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Size guide</p>
            <h2 id="size-guide-title" className="mt-2 font-serif text-[1.9rem] font-light tracking-[-0.03em]">
              Three sizes, one feel.
            </h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close size guide" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-oat-soft">
            <X className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </button>
        </div>
        <div className="mt-6">
          <SizeGuide compact highlight={highlight} onPick={(s) => { onPick(s); onClose(); }} />
        </div>
        <p className="mt-5 text-[0.8rem] leading-relaxed text-charcoal/55">{SIZE_GUIDE_NOTE}</p>
      </div>
    </div>
  );
}
