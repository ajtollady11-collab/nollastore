import { emailPlatform } from '@/data/marketing';

/**
 * Sends an email sign-up to the email platform.
 * ─────────────────────────────────────────────────────────────
 * With Klaviyo configured (data/marketing.ts → emailPlatform), this calls
 * Klaviyo's public "Create Client Subscription" endpoint, which is built to
 * be called from the browser with the public key only.
 *
 * With nothing configured, it returns { delivered: false }: the UI still
 * reveals the code, but the email is NOT stored anywhere. Connect a
 * platform before driving traffic to the site.
 */

export type SubscribeSource = 'footer';
export type SubscribeResult = { ok: true; delivered: boolean } | { ok: false; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export async function subscribe(
  email: string,
  source: SubscribeSource,
  properties: Record<string, string> = {},
): Promise<SubscribeResult> {
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) return { ok: false, message: 'Please enter a valid email address.' };

  const { klaviyoPublicKey, klaviyoListId } = emailPlatform;
  if (!klaviyoPublicKey || !klaviyoListId) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[nolla] Email platform not connected; sign-up not stored:', { source, ...properties });
    }
    return { ok: true, delivered: false };
  }

  const body = (listId: string) =>
    JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Nolla website footer',
          profile: {
            data: {
              type: 'profile',
              attributes: { email: clean, properties: { nolla_signup_source: source, ...properties } },
            },
          },
        },
        relationships: { list: { data: { type: 'list', id: listId } } },
      },
    });

  const send = (companyId: string, listId: string) =>
    fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${encodeURIComponent(companyId)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/vnd.api+json', revision: '2024-10-15' },
      body: body(listId),
    });

  try {
    let res = await send(klaviyoPublicKey, klaviyoListId);
    // Safety net: Klaviyo's public key and list ID look alike (6 characters each).
    // If they were entered the wrong way round, Klaviyo rejects the request; retry swapped.
    if (!res.ok && res.status >= 400 && res.status < 500) {
      const swapped = await send(klaviyoListId, klaviyoPublicKey);
      if (swapped.ok) {
        console.warn('[nolla] Klaviyo key and list ID appear to be swapped in data/marketing.ts.');
        res = swapped;
      }
    }
    if (!res.ok) return { ok: false, message: 'Something went wrong. Please try again in a moment.' };
    return { ok: true, delivered: true };
  } catch {
    return { ok: false, message: 'We couldn’t connect. Check your internet and try again.' };
  }
}
