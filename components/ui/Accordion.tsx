'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

export type AccordionItem = { id: string; title: React.ReactNode; body: React.ReactNode };

/**
 * Hairline accordion. Opens to the content's natural height using the
 * CSS grid-rows 0fr → 1fr technique (no JS measuring). One panel open at a time.
 */
export function Accordion({
  items,
  defaultOpen,
  className,
  tone = 'line',
  headingLevel = 3,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
  tone?: 'line' | 'large';
  headingLevel?: 2 | 3;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const baseId = useId();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className={cn('divide-y divide-charcoal/10 border-y border-charcoal/10', className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;
        return (
          <div key={item.id}>
            <Heading className="font-sans">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className={cn(
                  'group flex w-full items-center justify-between gap-6 text-left text-charcoal',
                  tone === 'large' ? 'min-h-[4.25rem] py-5 text-[1.02rem] sm:text-[1.08rem]' : 'min-h-[3.25rem] py-3.5 text-[0.92rem] font-medium',
                )}
              >
                <span className="transition-colors group-hover:text-mocha">{item.title}</span>
                <span className="relative h-3.5 w-3.5 shrink-0 text-charcoal/70" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                  <span className={cn('absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-soft', isOpen && 'scale-y-0')} />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn('grid transition-[grid-template-rows,opacity] duration-500 ease-soft', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className={cn('max-w-[62ch] leading-relaxed text-charcoal/70', tone === 'large' ? 'pb-6 text-[0.98rem]' : 'pb-4 text-[0.88rem]')}>{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
