/**
 * ─────────────────────────────────────────────────────────────
 *  EMAIL SIGN-UP + DISCOUNT CODES
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Valid discount codes, applied to the Square order by the server.
 * Percentages apply to products only (not delivery).
 * NOTE: codes aren't limited to one use per customer yet; anyone with the code can use it.
 * NOLLA10 was given out by the previous site's sign-up popup, so it stays valid.
 */
export const discountCodes: Record<string, { percent: number; label: string }> = {
  NOLLA10: { percent: 10, label: '10% off' },
};

/**
 * Email platform. With `klaviyoPublicKey` set, sign-ups go to that Klaviyo list.
 * The public key is designed to sit in website code; never paste a private key here.
 */
export const emailPlatform = {
  klaviyoPublicKey: 'YgSsS7' as string | null,
  klaviyoListId: 'VuEfbt' as string | null,
};

/** Consent line shown under every email field (UK PECR/GDPR: be clear what they're signing up for). */
export const consentText = 'Occasional emails from nolla. Unsubscribe any time.';

/** Footer sign-up wording */
export const newsletterCopy = {
  title: 'Notes from nolla.',
  body: 'New colours, restocks and the odd offer. Nothing more.',
  cta: 'Sign up',
  thanks: 'Thank you. You’re on the list.',
};
