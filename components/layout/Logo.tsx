import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/data/site';
import { cn } from '@/lib/cn';

/**
 * The nolla wordmark, set in the soft serif (the same wordmark as the current site).
 * When a logo file is ready, set `site.logo.src` in data/site.ts and this renders it instead.
 */
export function Logo({ className, size = 'md', tone = 'dark' }: { className?: string; size?: 'md' | 'lg'; tone?: 'dark' | 'light' }) {
  const text = size === 'lg' ? 'text-[3rem] sm:text-[3.5rem]' : 'text-[1.75rem]';
  return (
    <Link href="/" aria-label="nolla home" className={cn('inline-flex items-center leading-none', tone === 'dark' ? 'text-charcoal' : 'text-ivory', className)}>
      {site.logo.src ? (
        <Image src={site.logo.src} alt="nolla" width={site.logo.width} height={site.logo.height} priority />
      ) : (
        <span className={cn('font-serif font-normal lowercase tracking-[-0.045em]', text)} style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 72" }}>
          nolla
        </span>
      )}
    </Link>
  );
}
