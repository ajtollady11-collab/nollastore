import type { LegalPageContent } from '@/data/legal';

/** Readable long-form layout for Privacy, Terms and Shipping & Returns. */
export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <section className="container-soft pb-24 pt-8 sm:pt-14">
      <div className="max-w-2xl">
        <h1 className="font-serif text-[3rem] font-light leading-[0.95] tracking-[-0.045em] sm:text-display-md">{content.title}</h1>
        <p className="mt-4 text-sm text-charcoal/50">Last updated: {content.updated}</p>
        <p className="mt-6 text-lg leading-relaxed text-charcoal/75">{content.intro}</p>

        <div className="mt-12 space-y-10">
          {content.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-serif text-[1.55rem] font-light tracking-[-0.02em]">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-[0.98rem] leading-relaxed text-charcoal/75">
                {s.p?.map((t) => <p key={t}>{t}</p>)}
                {s.list && (
                  <ul className="space-y-1.5 pl-5 marker:text-mocha/60 [list-style:disc]">
                    {s.list.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((t) => <p key={t}>{t}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
