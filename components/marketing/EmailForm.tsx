'use client';

import { useEffect, useId, useState } from 'react';
import { consentText, newsletterCopy } from '@/data/marketing';
import { subscribe, type SubscribeSource } from '@/lib/subscribe';
import { hasSubmittedEmail, markEmailSubmitted } from '@/lib/emailState';
import { cn } from '@/lib/cn';

/** Inline email sign-up (input + button). Sends to Klaviyo when configured in data/marketing.ts. */
export function EmailForm({ source, className }: { source: SubscribeSource; className?: string }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => setDone(hasSubmittedEmail()), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    const result = await subscribe(email, source);
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    markEmailSubmitted(source);
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className={cn('text-[0.92rem] text-charcoal/75', className)}>
        {newsletterCopy.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('w-full', className)}>
      <div className="flex gap-2">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : `${id}-consent`}
          className={cn(
            'h-12 min-w-0 flex-1 rounded-full border bg-ivory px-5 text-[1rem] text-charcoal outline-none transition-[border-color] placeholder:text-charcoal/40 focus:border-charcoal/50',
            error ? 'border-mocha' : 'border-charcoal/15',
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className="h-12 shrink-0 rounded-full bg-charcoal px-6 text-[0.9rem] font-medium text-ivory transition-colors hover:bg-espresso disabled:opacity-60"
        >
          {pending ? 'One moment…' : newsletterCopy.cta}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 px-2 text-xs text-mocha">
          {error}
        </p>
      )}
      <p id={`${id}-consent`} className="mt-2.5 px-2 text-[0.72rem] leading-relaxed text-charcoal/50">
        {consentText}{' '}
        <a href="/privacy" className="underline decoration-charcoal/20 underline-offset-2 hover:text-charcoal">
          Privacy policy
        </a>
      </p>
    </form>
  );
}
