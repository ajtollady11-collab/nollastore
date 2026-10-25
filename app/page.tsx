import { Hero } from '@/components/home/Hero';
import { RealLife } from '@/components/home/RealLife';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { Moments } from '@/components/home/Moments';
import { Benefits } from '@/components/home/Benefits';
import { Story } from '@/components/home/Story';
import { FinalCta } from '@/components/home/FinalCta';

/**
 * The home page: hero → real-life videos → reviews → staying in → why it belongs →
 * our story → final call. The blanket itself (photos, colours, sizes, buying) lives on /shop.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <RealLife />
      <ReviewSection />
      <Moments />
      <Benefits />
      <Story />
      <FinalCta />
    </>
  );
}
