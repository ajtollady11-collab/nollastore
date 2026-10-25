'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Lock } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { DiscountField } from '@/components/cart/DiscountField';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { countries, UK_CODE } from '@/data/countries';
import { GIFT, PRODUCT, US_PRICE_COUNTRIES, cartImageFor, chargedPriceFor, describeSelection } from '@/data/product';
import { useRegion } from '@/components/store/RegionProvider';
import { TM } from '@/components/ui/TM';
import { shippingRegions } from '@/data/site';
import { formatPrice } from '@/lib/format';
import { startCheckout } from '@/lib/checkout';
import type { DeliveryDetails } from '@/lib/order';
import { cn } from '@/lib/cn';

const EMPTY: DeliveryDetails = {
  email: '',
  name: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  region: '',
  postcode: '',
  country: UK_CODE,
};

/** Remember details on this device so a returning customer doesn't retype them */
const SAVED_KEY = 'nolla-delivery-v1';

export function CheckoutForm() {
  const {
    ready, lines, chargeSubtotal: subtotal, setDeliveryCountry, discountAmount, discountCode, shippingCost, total,
    shippingRegion, setShippingRegion, shippingMethod, setShippingMethod,
    gifts,
  } = useCart();
  const { region, info, setRegion, ready: regionReady } = useRegion();
  const payingInOtherCurrency = region !== 'GBP';
  const [d, setD] = useState<DeliveryDetails>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [badField, setBadField] = useState<keyof DeliveryDetails | null>(null);
  const [pending, setPending] = useState(false);

  // Load saved details once
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? 'null');
      if (saved && typeof saved === 'object') setD({ ...EMPTY, ...saved });
    } catch {
      /* ignore */
    }
  }, []);

  // Dollar shoppers start with the US selected (if they haven't saved details before)
  useEffect(() => {
    if (region === 'USD') setD((prev) => (prev.address1 ? prev : { ...prev, country: 'US' }));
  }, [region]);

  // The delivery country decides the price list (US vs UK) and the delivery options
  useEffect(() => setDeliveryCountry(d.country), [d.country, setDeliveryCountry]);

  const isUK = d.country === UK_CODE;
  useEffect(() => {
    const region = isUK ? 'uk' : 'international';
    if (shippingRegion !== region) setShippingRegion(region);
  }, [isUK, shippingRegion, setShippingRegion]);

  const methods = shippingRegions[isUK ? 'uk' : 'international'].methods;

  function set<K extends keyof DeliveryDetails>(key: K, value: DeliveryDetails[K]) {
    setD((prev) => ({ ...prev, [key]: value }));
    if (badField === key) {
      setBadField(null);
      setError(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    setBadField(null);
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(d));
    } catch {
      /* ignore */
    }
    const result = await startCheckout(region, lines, shippingMethod, discountCode, d);
    if (result.ok) {
      window.location.href = result.redirectUrl;
      return;
    }
    setPending(false);
    setError(result.message);
    if (result.field) {
      setBadField(result.field);
      document.getElementById(`co-${result.field}`)?.focus();
    }
  }

  const summaryLines = useMemo(
    () =>
      lines.map((l) => ({
        key: l.key,
        variant: describeSelection(l.selection),
        qty: l.quantity,
        price: chargedPriceFor(l.selection.size, d.country) * l.quantity,
        img: cartImageFor(l.selection.colour),
      })),
    [lines, d.country],
  );

  if (!ready || !regionReady) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (!info.checkout.enabled) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-[2.4rem] font-light tracking-[-0.035em]">Checkout in {region} isn’t open yet.</h1>
        <p className="mt-4 max-w-[52ch] text-charcoal/65">{info.checkout.closedMessage}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button onClick={() => setRegion('GBP')} size="lg">
            Switch to pounds (£ GBP)
          </Button>
          <Button href="/shop" variant="secondary" size="lg">
            Back to the shop
          </Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-[2.4rem] font-light tracking-[-0.035em]">Your bag is empty.</h1>
        <p className="mt-3 text-charcoal/65">Every blanket comes with a free cloud pillow.</p>
        <Button href="/shop" size="lg" className="mt-8">
          Shop the blanket
        </Button>
      </div>
    );
  }

  const field = (key: keyof DeliveryDetails) =>
    cn(
      'h-12 w-full rounded-soft border bg-ivory px-4 text-[1rem] text-charcoal outline-none transition-[border-color,box-shadow] placeholder:text-charcoal/35 focus:border-charcoal/40 focus:shadow-[0_0_0_4px_rgba(118,95,80,0.1)]',
      badField === key ? 'border-mocha' : 'border-charcoal/[0.12]',
    );
  const label = 'mb-1.5 block text-sm text-charcoal/70';

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
      {/* ── Delivery details ── */}
      <form onSubmit={submit} noValidate className="order-2 min-w-0 lg:order-1">
        <h1 className="font-serif text-[2.4rem] font-light leading-none tracking-[-0.035em] sm:text-display-sm">Delivery details</h1>
        <p className="mt-3 text-charcoal/65">Where should we send your Nolla?</p>

        <fieldset className="mt-8 space-y-4">
          <legend className="eyebrow mb-3">Contact</legend>
          <div>
            <label htmlFor="co-email" className={label}>Email</label>
            <input id="co-email" type="email" inputMode="email" autoComplete="email" required value={d.email} onChange={(e) => set('email', e.target.value)} className={field('email')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="co-name" className={label}>Full name</label>
              <input id="co-name" autoComplete="name" required value={d.name} onChange={(e) => set('name', e.target.value)} className={field('name')} />
            </div>
            <div>
              <label htmlFor="co-phone" className={label}>Phone <span className="text-charcoal/40">(for the courier)</span></label>
              <input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" required value={d.phone} onChange={(e) => set('phone', e.target.value)} className={field('phone')} />
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-8 space-y-4">
          <legend className="eyebrow mb-3">Address</legend>
          <div>
            <label htmlFor="co-country" className={label}>Country</label>
            <select id="co-country" autoComplete="country" value={d.country} onChange={(e) => set('country', e.target.value)} className={cn(field('country'), 'min-w-0')}>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="co-address1" className={label}>Address</label>
            <input id="co-address1" autoComplete="address-line1" required value={d.address1} onChange={(e) => set('address1', e.target.value)} placeholder="House number and street" className={field('address1')} />
          </div>
          <div>
            <label htmlFor="co-address2" className="sr-only">Apartment, suite, etc. (optional)</label>
            <input id="co-address2" autoComplete="address-line2" value={d.address2} onChange={(e) => set('address2', e.target.value)} placeholder="Flat, apartment, etc. (optional)" className={field('address2')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="co-city" className={label}>Town / city</label>
              <input id="co-city" autoComplete="address-level2" required value={d.city} onChange={(e) => set('city', e.target.value)} className={field('city')} />
            </div>
            <div>
              <label htmlFor="co-postcode" className={label}>{isUK ? 'Postcode' : 'Postcode / ZIP'}</label>
              <input id="co-postcode" autoComplete="postal-code" autoCapitalize="characters" required value={d.postcode} onChange={(e) => set('postcode', e.target.value)} className={field('postcode')} />
            </div>
          </div>
          {!isUK && (
            <div>
              <label htmlFor="co-region" className={label}>State / province / county <span className="text-charcoal/40">(if applicable)</span></label>
              <input id="co-region" autoComplete="address-level1" value={d.region} onChange={(e) => set('region', e.target.value)} className={field('region')} />
            </div>
          )}
        </fieldset>

        <fieldset className="mt-8">
          <legend className="eyebrow mb-3">Delivery</legend>
          <div className="space-y-2" role="radiogroup" aria-label="Delivery option">
            {methods.map((m) => {
              const selected = m.id === shippingMethod;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setShippingMethod(m.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-soft border px-4 py-3.5 text-left transition-[background-color,border-color] duration-300',
                    selected ? 'border-charcoal bg-ivory' : 'border-charcoal/[0.14] hover:border-charcoal/40',
                  )}
                >
                  <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border', selected ? 'border-charcoal bg-charcoal' : 'border-charcoal/25')} aria-hidden>
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-cream" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-charcoal/55">{m.estimate}</span>
                  </span>
                  <span className="text-sm font-medium">{m.price === 0 ? 'Free' : formatPrice(m.price)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-6 rounded-soft bg-mocha-soft px-4 py-3 text-sm text-charcoal/80">
            {error}
          </p>
        )}

        {payingInOtherCurrency && (
          <p className="mt-6 rounded-soft border border-charcoal/10 bg-ivory px-4 py-3 text-[0.85rem] leading-relaxed text-charcoal/70">
            You’re browsing in {region}. Orders are charged in pounds (GBP), so you’ll pay {formatPrice(total)} and your card provider converts it.
            {US_PRICE_COUNTRIES.includes(d.country) && ' US deliveries are charged at our US prices.'}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="group mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-charcoal text-[1rem] font-medium text-ivory transition-colors duration-300 hover:bg-espresso active:scale-[0.99] disabled:opacity-60"
        >
          {pending ? 'One moment…' : <>Continue to payment · {formatPrice(total)}</>}
          {!pending && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-charcoal/50">
          <Lock className="h-3 w-3" aria-hidden />
          You’ll pay securely with Square on the next page. Card, Apple Pay and Google Pay.
        </p>
      </form>

      {/* ── Order summary ── */}
      <aside className="order-1 min-w-0 lg:order-2">
        <div className="rounded-soft border border-charcoal/10 bg-ivory p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-light tracking-[-0.02em]">Your order</h2>
            <Link href="/" className="text-xs text-charcoal/55 underline decoration-charcoal/20 underline-offset-4 hover:text-charcoal">
              Keep shopping
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {summaryLines.map((l) => (
              <li key={l.key} className="flex items-center gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-soft bg-oat-soft">
                  <SmartImage src={l.img.src} alt="" fill sizes="56px" className="object-cover" />
                  {l.qty > 1 && <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal px-1 text-[0.6rem] font-semibold text-cream">{l.qty}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight"><TM>{PRODUCT.shortName}</TM></p>
                  <p className="mt-0.5 truncate text-xs text-charcoal/55">{l.variant}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(l.price)}</p>
              </li>
            ))}
            <li className="flex items-center gap-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-soft bg-oat">
                <SmartImage src={GIFT.image.src} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium leading-tight">
                  <Gift className="h-3.5 w-3.5 text-mocha" aria-hidden />
                  <span>
                    <TM>{GIFT.name}</TM>
                    {gifts > 1 && <span className="ml-1 font-normal text-charcoal/55">× {gifts}</span>}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-charcoal/55">Free gift, added automatically</p>
              </div>
              <p className="text-sm font-semibold text-mocha">FREE</p>
            </li>
          </ul>

          <div className="mt-6 border-t border-charcoal/10 pt-5">
            <DiscountField />
          </div>

          <dl className="mt-5 space-y-1.5 border-t border-charcoal/10 pt-5 text-sm">
            <div className="flex justify-between text-charcoal/65">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-mocha">
                <dt>Discount ({discountCode})</dt>
                <dd>−{formatPrice(discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-charcoal/65">
              <dt>Delivery</dt>
              <dd>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-medium">Total</dt>
              <dd className="text-xl font-semibold tracking-tight">{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
