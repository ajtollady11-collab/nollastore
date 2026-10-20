'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';

/** Empties the cart once, when the customer lands back from a completed Square payment. */
export function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    // Wait a tick so the saved cart has loaded before clearing it
    const t = window.setTimeout(clear, 50);
    return () => window.clearTimeout(t);
  }, [clear]);
  return null;
}
