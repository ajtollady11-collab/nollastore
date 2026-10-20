'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { describeSelection, type Selection } from '@/data/product';
import { discountCodes } from '@/data/marketing';
import { shippingRegions, type ShippingMethodId, type ShippingRegion } from '@/data/site';
import { normaliseCode } from '@/lib/order';
import { blanketCount, cartReducer, cartSubtotal, giftCount, lineKey, sanitiseLines, type CartLine, type CartState } from '@/lib/cart';
import { useRegion } from '@/components/store/RegionProvider';

/**
 * The bag. Saved to this device so it survives refreshes and page changes.
 * Prices are never stored: they're worked out for the current storefront,
 * so switching currency re-prices everything at once. Checkout totals are GBP.
 */

// Bumped when the catalogue changed to the single blanket, so old carts (Nest, Nook) are dropped
const STORAGE_KEY = 'nolla-bag-v3';

type CartContextValue = {
  lines: CartLine[];
  /** Blankets in the bag */
  count: number;
  /** Free pillows the bag has earned */
  gifts: number;
  /** In the shopper's currency, for display */
  subtotal: number;
  /** In GBP: what checkout charges */
  chargeSubtotal: number;
  shippingRegion: ShippingRegion;
  setShippingRegion: (region: ShippingRegion) => void;
  shippingMethod: ShippingMethodId;
  setShippingMethod: (id: ShippingMethodId) => void;
  shippingCost: number;
  discountCode: string | null;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  discountAmount: number;
  total: number;
  clear: () => void;
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (selection: Selection, opts?: { quantity?: number; openCart?: boolean }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  /** Key of the most recently added line, for a gentle highlight */
  lastAddedKey: string | null;
  /** Polite screen-reader message after cart changes */
  announcement: string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { region, rates } = useRegion();
  const [state, dispatch] = useReducer(cartReducer, { lines: [] } satisfies CartState);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [shippingRegion, setRegionState] = useState<ShippingRegion>('uk');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('uk-free');
  const hydrated = useRef(false);
  const [ready, setReady] = useState(false);

  const setShippingRegion = useCallback((r: ShippingRegion) => {
    setRegionState(r);
    setShippingMethod(shippingRegions[r].methods[0].id);
  }, []);

  // Load the saved bag once
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', state: { lines: sanitiseLines(JSON.parse(raw)?.lines) } });
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true;
    setReady(true);
  }, []);

  // Save on change, after loading
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [state]);

  // Keep other open tabs in step
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        dispatch({ type: 'hydrate', state: { lines: sanitiseLines(JSON.parse(e.newValue)?.lines) } });
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setLastAddedKey(null);
  }, []);

  const add = useCallback<CartContextValue['add']>((selection, opts) => {
    dispatch({ type: 'add', selection, quantity: opts?.quantity });
    setLastAddedKey(lineKey(selection));
    setAnnouncement(`Added the ${describeSelection(selection)} blanket to your bag, with a free cloud pillow.`);
    if (opts?.openCart !== false) setIsOpen(true);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: 'setQuantity', key, quantity });
    setAnnouncement(quantity > 0 ? `Quantity updated to ${quantity}.` : 'Item removed from your bag.');
  }, []);
  const remove = useCallback((key: string) => {
    dispatch({ type: 'remove', key });
    setAnnouncement('Item removed from your bag.');
  }, []);

  const subtotal = cartSubtotal(state.lines, region, rates);
  const chargeSubtotal = cartSubtotal(state.lines, 'GBP');
  const method = shippingRegions[shippingRegion].methods.find((m) => m.id === shippingMethod) ?? shippingRegions[shippingRegion].methods[0];
  const shippingCost = state.lines.length ? method.price : 0;
  const discountAmount = discountCode ? Math.round((chargeSubtotal * discountCodes[discountCode].percent) / 100) : 0;

  const applyDiscountCode = useCallback((code: string) => {
    const valid = normaliseCode(code);
    if (valid) setDiscountCode(valid);
    return Boolean(valid);
  }, []);
  const removeDiscountCode = useCallback(() => setDiscountCode(null), []);
  const clear = useCallback(() => {
    dispatch({ type: 'clear' });
    setDiscountCode(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      count: blanketCount(state.lines),
      gifts: giftCount(state.lines),
      subtotal,
      chargeSubtotal,
      shippingRegion,
      setShippingRegion,
      shippingMethod: method.id,
      setShippingMethod,
      shippingCost,
      discountCode,
      applyDiscountCode,
      removeDiscountCode,
      discountAmount,
      total: chargeSubtotal - discountAmount + shippingCost,
      clear,
      ready,
      isOpen,
      open,
      close,
      add,
      setQuantity,
      remove,
      lastAddedKey,
      announcement,
    }),
    [state.lines, subtotal, chargeSubtotal, shippingRegion, setShippingRegion, method.id, shippingCost, discountCode, applyDiscountCode, removeDiscountCode, discountAmount, clear, ready, isOpen, open, close, add, setQuantity, remove, lastAddedKey, announcement],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
