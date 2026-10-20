import { giftQuantity, isValidSelection, priceFor, type Rates, type Selection } from '@/data/product';
import type { RegionId } from '@/data/regions';

/**
 * Pure cart logic. No React here, so the same rules can run on the server.
 * A cart line is one colour/size combination of the blanket. The free pillow is
 * never stored as a line: it's derived from the blankets (see giftQuantity).
 * Lines don't store prices either: the price always comes from data/product.ts
 * for the current currency, so switching currency re-prices the whole cart.
 */

export type CartLine = {
  /** colour|size: identical items merge into one line */
  key: string;
  selection: Selection;
  quantity: number;
};

export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: 'add'; selection: Selection; quantity?: number }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'hydrate'; state: CartState }
  | { type: 'clear' };

export const MAX_QTY = 10;

export const lineKey = (s: Selection) => `${s.colour}|${s.size}`;

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      if (!isValidSelection(action.selection)) return state;
      const key = lineKey(action.selection);
      const qty = Math.max(1, action.quantity ?? 1);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return { lines: state.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) } : l)) };
      }
      return { lines: [...state.lines, { key, selection: { ...action.selection }, quantity: Math.min(MAX_QTY, qty) }] };
    }
    case 'setQuantity':
      if (action.quantity <= 0) return { lines: state.lines.filter((l) => l.key !== action.key) };
      return { lines: state.lines.map((l) => (l.key === action.key ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l)) };
    case 'remove':
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case 'hydrate':
      return action.state;
    case 'clear':
      return { lines: [] };
    default:
      return state;
  }
}

/** Keep only well-formed lines (used when loading a saved cart) */
export function sanitiseLines(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((l): l is CartLine => Boolean(l) && isValidSelection((l as CartLine).selection) && Number.isInteger((l as CartLine).quantity))
    .map((l) => ({ key: lineKey(l.selection), selection: { colour: l.selection.colour, size: l.selection.size }, quantity: Math.min(MAX_QTY, Math.max(1, l.quantity)) }));
}

/** Number of blankets in the cart */
export const blanketCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);

/** Free pillows earned by the cart (rule set in data/product.ts → GIFT.mode) */
export const giftCount = (lines: CartLine[]) => giftQuantity(blanketCount(lines));

export const linePrice = (line: CartLine, region: RegionId, rates?: Rates) => priceFor(line.selection.size, region, rates).price;

export const cartSubtotal = (lines: CartLine[], region: RegionId, rates?: Rates) =>
  lines.reduce((sum, l) => sum + linePrice(l, region, rates) * l.quantity, 0);
