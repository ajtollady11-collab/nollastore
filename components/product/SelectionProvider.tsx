'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_SELECTION, collectionOf, matchingSize, type ColourId, type Selection, type SizeId } from '@/data/product';

/**
 * The colour and size currently chosen on the page.
 * Shared by the purchase panel, the sticky add-to-bag bar and the fabric
 * section, so they always agree on what the customer is about to buy.
 */

type SelectionContextValue = {
  selection: Selection;
  setColour: (c: ColourId) => void;
  setSize: (s: SizeId) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children, initial = DEFAULT_SELECTION }: { children: React.ReactNode; initial?: Selection }) {
  const [selection, setSelection] = useState<Selection>(initial);
  // Changing one option keeps the other. Moving between the classic and custom collections
  // keeps the same size tier (Medium / Large / Extra Large) in that collection's sizes.
  const setColour = useCallback(
    (colour: ColourId) =>
      setSelection((s) => ({
        colour,
        size: matchingSize(s.size, collectionOf(colour)),
      })),
    [],
  );
  const setSize = useCallback((size: SizeId) => setSelection((s) => ({ ...s, size })), []);
  const value = useMemo(() => ({ selection, setColour, setSize }), [selection, setColour, setSize]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used inside <SelectionProvider>');
  return ctx;
}
