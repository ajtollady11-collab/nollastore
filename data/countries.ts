/**
 * ─────────────────────────────────────────────────────────────
 *  COUNTRIES WE SHIP TO
 *  Only these appear in the checkout country list, and the server refuses
 *  orders to anywhere else. Shipping is free to all of them.
 *  To add or remove a country, edit this list (ISO 2-letter code + name).
 * ─────────────────────────────────────────────────────────────
 */
export const countries: { code: string; name: string }[] = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
];

export const UK_CODE = 'GB';
export const countryName = (code: string) => countries.find((c) => c.code === code)?.name ?? code;
export const shipsTo = (code: string) => countries.some((c) => c.code === code.toUpperCase());

/** "the UK, the US, Canada, … and Finland" for sentences */
export const SHIPPING_COUNTRIES_TEXT = (() => {
  const names = countries.map((c) => (['GB', 'US', 'NL'].includes(c.code) ? `the ${c.code === 'GB' ? 'UK' : c.code === 'US' ? 'US' : 'Netherlands'}` : c.name));
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
})();
