import { create } from 'zustand';

import { pantryItems } from './mock';
import type { PantryItem } from './types';

export function removePantryItems(items: PantryItem[], itemIds: string[]): PantryItem[] {
  const selectedItemIds = new Set(itemIds);

  return items.filter((item) => !selectedItemIds.has(item.id));
}

type PantryState = {
  items: PantryItem[];
  removeItems: (itemIds: string[]) => void;
};

export const usePantryStore = create<PantryState>((set) => ({
  items: pantryItems,
  removeItems: (itemIds) => set((state) => ({ items: removePantryItems(state.items, itemIds) })),
}));
