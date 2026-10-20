import Link from 'next/link';
import { Logo } from './Logo';
import { SocialIcon } from '@/components/ui/SocialIcons';
import { EmailForm } from '@/components/marketing/EmailForm';
import { RegionSelect } from '@/components/store/RegionSelect';
import { footerLinks, site, socials } from '@/data/site';
import { newsletterCopy } from '@/data/marketing';

export function Footer() {
  return (
    <footer className="bg-ivory" data-sticky-stop>
      <div className="container-soft pb-10 pt-16 sm:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 max-w-[30ch] font-serif text-[1.25rem] font-light leading-snug text-charcoal/70">
              Soft, generous things for the hours you spend at home. Make staying in feel better.
            </p>
            <div className="mt-10 max-w-md">
              <p className="font-medium">{newsletterCopy.title}</p>
              <p className="mt-1 text-[0.9rem] text-charcoal/60">{newsletterCopy.body}</p>
              <EmailForm source="footer" className="mt-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <p className="text-[0.8rem] text-charcoal/50">{group.title}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[0.92rem] text-charcoal/80 transition-colors hover:text-charcoal">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3">
              <p className="text-[0.8rem] text-charcoal/50">Get in touch</p>
              <a href={`mailto:${site.contactEmail}`} className="link mt-3 inline-block text-[0.92rem]">
                {site.contactEmail}
              </a>
              {socials.length > 0 && (
                <ul className="mt-5 flex gap-2">
                  {socials.map((s) => (
                    <li key={s.name}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`nolla on ${s.name}`} className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15 text-charcoal/80 hover:border-charcoal hover:text-charcoal">
                        <SocialIcon name={s.icon} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-charcoal/10 pt-6 text-[0.78rem] text-charcoal/55 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p>Secure checkout by Square. Pay by card, Apple Pay or Google Pay. UK orders are charged in pounds (GBP).</p>
            <p>
              © {new Date().getFullYear()} nolla. All rights reserved. Nuv™ and Nimbus™ are trademarks of nolla.
            </p>
          </div>
          <RegionSelect className="-ml-3 self-start lg:ml-0 lg:self-auto" />
        </div>
      </div>
    </footer>
  );
}
