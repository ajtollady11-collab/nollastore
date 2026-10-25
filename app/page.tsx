import { Hero } from '@/components/home/Hero';
import { Moments } from '@/components/home/Moments';
import { Benefits } from '@/components/home/Benefits';
import { Story } from '@/components/home/Story';
import { FinalCta } from '@/components/home/FinalCta';

/**
 * The home page: hero → staying in → why it belongs → our story → final call.
 * The blanket itself (photos, colours, sizes, buying) lives on /shop.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Moments />
      <Benefits />
      <Story />
      <FinalCta />
    </>
  );
}
