/**
 * Remembers on this browser that someone has signed up, so the footer
 * form can say thanks instead of asking again. Storage access is guarded
 * because it can be unavailable (private browsing).
 */

const SUBMITTED_KEY = 'nolla-email-submitted';

export function hasSubmittedEmail(): boolean {
  try {
    return window.localStorage.getItem(SUBMITTED_KEY) !== null;
  } catch {
    return false;
  }
}

export function markEmailSubmitted(source: string) {
  try {
    window.localStorage.setItem(SUBMITTED_KEY, JSON.stringify({ source, at: new Date().toISOString() }));
  } catch {
    /* ignore */
  }
}
