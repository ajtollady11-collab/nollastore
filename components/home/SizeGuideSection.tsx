'use client';

import { SizeGuide, SIZE_GUIDE_NOTE } from '@/components/product/SizeGuide';
import { useSelection } from '@/components/product/SelectionProvider';
import { Reveal } from '@/components/ui/Reveal';
import type { SizeId } from '@/data/product';

/** Size guide on the page. Choosing a size here sets it in the purchase panel and takes you there. */
export function SizeGuideSection() {
  const { selection, setSize } = useSelection();
  const pick = (s: SizeId) => {
    setSize(s);
    document.getElementById('shop')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <section id="size-guide" aria-labelledby="size-guide-heading" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-soft">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Size guide</p>
          <h2 id="size-guide-heading" className="headline mt-4">
            Which size is yours?
          </h2>
          <p className="prose-soft mt-5 max-w-[48ch]">
            The smallest is a cosy throw for one. The two larger sizes give you more to wrap up in, share, or spread across a bed or sofa.
          </p>
        </Reveal>
        <Reveal className="mt-12">
          <SizeGuide highlight={selection.size} onPick={pick} />
        </Reveal>
        <p className="mt-6 max-w-[70ch] text-[0.82rem] leading-relaxed text-charcoal/55">{SIZE_GUIDE_NOTE}</p>
      </div>
    </section>
  );
}
