/** Brand glyphs drawn inline (Lucide doesn't ship TikTok, and brand icons are being phased out there). */
export function SocialIcon({ name, className }: { name: 'tiktok' | 'instagram' | 'pinterest'; className?: string }) {
  const common = { className, width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const;
  switch (name) {
    case 'tiktok':
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.2c-1.4.1-2.7-.3-3.9-1v5.9c0 3.9-3.3 6.4-6.8 5.8-3.9-.7-5.4-5-3.5-8.2 1.2-2 3.4-2.9 5.8-2.6v3.3c-1.4-.4-2.9.3-3.2 1.7-.4 1.6.9 3 2.4 2.9 1.4 0 2.3-1.1 2.3-2.5V3h3Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2.5a9.5 9.5 0 0 0-3.5 18.3c-.1-.8-.2-2 0-2.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9.5 9.5 0 1 0 12 2.5Z" />
        </svg>
      );
  }
}
