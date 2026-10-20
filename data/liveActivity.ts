/**
 * ─────────────────────────────────────────────────────────────
 *  "PEOPLE CHECKING THIS OUT" MESSAGE (purchase section)
 *
 *  Switched OFF by default. A visitor/checkout number shown as "live" must
 *  reflect real activity: UK consumer law (CPRs / DMCC Act 2024) treats
 *  invented urgency figures as a misleading practice.
 *
 *  To use it with real numbers, connect `source` to your analytics
 *  (e.g. an API route returning the current count) and set `enabled: true`.
 *  `count` is only a fallback while that request loads.
 * ─────────────────────────────────────────────────────────────
 */
export const liveActivity = {
  enabled: false,
  /** Shown while the real figure loads (and if `source` is null) */
  count: 41,
  /** e.g. '/api/live-count' returning { count: number }. null = use `count` */
  source: null as string | null,
  /** {n} is replaced with the number */
  text: '{n} people are checking this out right now',
  /** Hide the line when the real number is below this */
  minimum: 5,
};
