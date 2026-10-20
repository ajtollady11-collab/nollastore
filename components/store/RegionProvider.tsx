'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_REGION, FALLBACK_RATES, RATES_URL, REGIONS, REGION_IDS, isRegionId, type Region, type RegionId } from '@/data/regions';
import { priceFor, type PriceInfo, type Rates, type SizeId } from '@/data/product';
import { formatMoney } from '@/lib/format';

/**
 * The currency the shopper is browsing in. Picked automatically from their
 * country (see middleware.ts); once they choose one themselves, that's remembered.
 * A link with ?currency=EUR (or ?region=EUR) sets it, which is handy for ads.
 * Live exchange rates load once and are cached for 12 hours; the fallback
 * table in data/regions.ts is used until then (or if they can't load).
 */

const STORAGE_KEY = 'nolla-currency';
const RATES_KEY = 'nolla-rates-v1';
const RATES_TTL = 12 * 60 * 60 * 1000;

type RegionContextValue = {
  region: RegionId;
  info: Region;
  setRegion: (r: RegionId) => void;
  /** Format an amount (in this currency's hundredths) */
  money: (amount: number) => string;
  /** Price for a size in the current currency */
  price: (size: SizeId) => PriceInfo;
  /** True when prices are a conversion (charged in GBP at checkout) */
  converted: boolean;
  rates: Rates;
  /** False on the server and until the saved currency has loaded */
  ready: boolean;
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<RegionId>(DEFAULT_REGION);
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: RegionId | null = null;
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = (params.get('currency') ?? params.get('region'))?.toUpperCase();
      // Older links used ?region=uk / ?region=us
      const legacy = fromUrl === 'UK' ? 'GBP' : fromUrl === 'US' ? 'USD' : fromUrl;
      if (isRegionId(legacy)) {
        initial = legacy;
        window.localStorage.setItem(STORAGE_KEY, legacy);
      } else {
        // 1. Their own earlier choice  2. Their country (set by middleware.ts)  3. Pounds
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const geo = document.cookie.match(/(?:^|; )nolla-geo-currency=([A-Z]{3})/)?.[1];
        if (isRegionId(saved)) initial = saved;
        else if (isRegionId(geo)) initial = geo;
      }
    } catch {
      /* storage unavailable */
    }
    if (initial) setRegionState(initial);
    setReady(true);
  }, []);

  // Live exchange rates (only matter for converted currencies)
  useEffect(() => {
    let cancelled = false;
    try {
      const cached = JSON.parse(window.localStorage.getItem(RATES_KEY) ?? 'null') as { at: number; rates: Rates } | null;
      if (cached && Date.now() - cached.at < RATES_TTL) {
        setRates({ ...FALLBACK_RATES, ...cached.rates });
        return;
      }
    } catch {
      /* ignore */
    }
    fetch(RATES_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { result?: string; rates?: Record<string, number> } | null) => {
        if (cancelled || json?.result !== 'success' || !json.rates) return;
        const next: Rates = {};
        for (const code of REGION_IDS) {
          const v = json.rates[code];
          if (typeof v === 'number' && v > 0) next[code] = v;
        }
        setRates({ ...FALLBACK_RATES, ...next });
        try {
          window.localStorage.setItem(RATES_KEY, JSON.stringify({ at: Date.now(), rates: next }));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* keep fallback rates */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setRegion = useCallback((r: RegionId) => {
    setRegionState(r);
    try {
      window.localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<RegionContextValue>(
    () => ({
      region,
      info: REGIONS[region],
      setRegion,
      money: (amount: number) => formatMoney(amount, region),
      price: (size: SizeId) => priceFor(size, region, rates),
      converted: REGIONS[region].pricing === 'converted',
      rates,
      ready,
    }),
    [region, setRegion, rates, ready],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be used inside <RegionProvider>');
  return ctx;
}
