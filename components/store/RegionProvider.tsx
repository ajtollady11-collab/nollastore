'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_REGION, REGIONS, isRegionId, type Region, type RegionId } from '@/data/regions';
import { formatMoney } from '@/lib/format';

/**
 * The storefront the shopper is viewing (UK £ or US $).
 * Remembered on this device. A link with ?region=us (or uk) sets it,
 * which is handy for US-targeted ads.
 */

const STORAGE_KEY = 'nolla-region';

type RegionContextValue = {
  region: RegionId;
  info: Region;
  setRegion: (r: RegionId) => void;
  /** Format an amount for the current storefront */
  money: (amount: number) => string;
  /** False on the server and until the saved preference has loaded */
  ready: boolean;
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<RegionId>(DEFAULT_REGION);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: RegionId | null = null;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('region')?.toLowerCase();
      if (isRegionId(fromUrl)) {
        initial = fromUrl;
        window.localStorage.setItem(STORAGE_KEY, fromUrl);
      } else {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (isRegionId(saved)) initial = saved;
      }
    } catch {
      /* storage unavailable */
    }
    if (initial) setRegionState(initial);
    setReady(true);
  }, []);

  const setRegion = useCallback((r: RegionId) => {
    setRegionState(r);
    try {
      window.localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
  }, []);

  // Keep <html lang> in step with the storefront
  useEffect(() => {
    document.documentElement.lang = REGIONS[region].locale;
  }, [region]);

  const value = useMemo<RegionContextValue>(
    () => ({ region, info: REGIONS[region], setRegion, money: (amount: number) => formatMoney(amount, region), ready }),
    [region, setRegion, ready],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be used inside <RegionProvider>');
  return ctx;
}
