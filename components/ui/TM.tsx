import { Fragment } from 'react';

/**
 * Renders a product name with a refined, smaller ™ mark.
 * Uses the real ™ character (one symbol only), just sized down,
 * so copying, search engines and screen readers all see "Nolla Nuv™".
 */
export function TM({ children }: { children: string }) {
  const parts = children.split('™');
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="ml-[0.02em] align-super font-sans text-[0.42em] font-normal tracking-normal">™</span>}
        </Fragment>
      ))}
    </>
  );
}
