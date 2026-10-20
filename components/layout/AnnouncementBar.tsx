'use client';

import { Fragment } from 'react';
import { useRegion } from '@/components/store/RegionProvider';
import { announcement } from '@/data/site';

/** One quiet line. Phones show the first message only, so it never wraps. */
export function AnnouncementBar() {
  const { region } = useRegion();
  const messages = [...announcement.everywhere, ...announcement[region]];
  return (
    <div className="bg-espresso text-ivory" role="region" aria-label="Announcements">
      <div className="container-soft flex h-9 items-center justify-center text-center text-[0.75rem] tracking-[0.02em] sm:text-[0.78rem]">
        <p className="truncate sm:hidden">{messages[0]}</p>
        <p className="hidden items-center gap-4 sm:flex">
          {messages.map((m, i) => (
            <Fragment key={m}>
              {i > 0 && (
                <span className="text-ivory/35" aria-hidden>
                  ·
                </span>
              )}
              <span className={i > 0 ? 'text-ivory/75' : undefined}>{m}</span>
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
