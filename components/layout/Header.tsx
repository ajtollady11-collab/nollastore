'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
import { CartButton } from '@/components/cart/CartButton';
import { RegionSelect } from '@/components/store/RegionSelect';
import { navLinks } from '@/data/site';
import { cn } from '@/lib/cn';

/**
 * Logo centred, three links, storefront and bag. Deliberately simple: we sell one thing.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    const button = menuButtonRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      button?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300',
          scrolled ? 'border-charcoal/10 bg-cream/90 backdrop-blur-md' : 'border-transparent bg-cream',
        )}
      >
        <div className="container-soft grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: nav (desktop) / menu (mobile) */}
          <div className="flex items-center">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full text-charcoal hover:bg-charcoal/[0.05] md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="-ml-1 rounded-full px-3 py-2 text-[0.9rem] text-charcoal/75 transition-colors first:ml-[-0.75rem] hover:text-charcoal">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-1">
            <RegionSelect className="hidden md:inline-flex" />
            <CartButton className="-mr-2.5" />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn('fixed inset-0 z-50 md:hidden', menuOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        inert={!menuOpen}
      >
        <div onClick={() => setMenuOpen(false)} className={cn('absolute inset-0 bg-charcoal/25 transition-opacity duration-300', menuOpen ? 'opacity-100' : 'opacity-0')} />
        <div
          className={cn(
            'absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto bg-cream px-4 pb-8 pt-3 transition-[transform,opacity] duration-500 ease-soft',
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
          )}
        >
          <div className="grid h-12 grid-cols-[1fr_auto_1fr] items-center">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full hover:bg-charcoal/[0.05]"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>
            <Logo />
            <span />
          </div>
          <nav aria-label="Mobile" className="mt-8 flex flex-col border-t border-charcoal/10">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-charcoal/10 py-4 font-serif text-[1.9rem] font-light leading-none tracking-[-0.03em] text-charcoal"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            <p className="mb-2 text-[0.8rem] text-charcoal/55">Storefront</p>
            <RegionSelect variant="full" className="w-full" />
          </div>
          <Button href="/#shop" onClick={() => setMenuOpen(false)} size="lg" fullWidth className="mt-8">
            Shop the blanket
          </Button>
        </div>
      </div>
    </>
  );
}
