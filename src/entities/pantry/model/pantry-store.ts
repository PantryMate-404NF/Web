import { create } from 'zustand';

import { pantryItems } from './mock';
import type { PantryItem, PantrySortOption, PantryStorageType } from './types';

export function removePantryItems(items: PantryItem[], itemIds: string[]): PantryItem[] {
  const selectedItemIds = new Set(itemIds);

  return items.filter((item) => !selectedItemIds.has(item.id));
}

export function filterPantryItems(
  items: PantryItem[],
  storageType?: PantryStorageType,
): PantryItem[] {
  return storageType ? items.filter((item) => item.storageType === storageType) : items;
}

export function sortPantryItems(items: PantryItem[], option: PantrySortOption): PantryItem[] {
  return [...items].sort((left, right) => {
    if (option === 'OLDEST') {
      return (left.createdAt ?? '').localeCompare(right.createdAt ?? '');
    }

    if (option === 'IMMINENT') {
      const priority = { EXPIRED: 0, IMMINENT: 1, NORMAL: 2, UNREGISTERED: 3 };
      const statusDifference = priority[left.expirationStatus] - priority[right.expirationStatus];

      if (statusDifference !== 0) return statusDifference;

      return (left.consumptionDate ?? '9999-12-31').localeCompare(
        right.consumptionDate ?? '9999-12-31',
      );
    }

    return (right.createdAt ?? '').localeCompare(left.createdAt ?? '');
  });
}

export function upsertPantryItem(items: PantryItem[], item: PantryItem): PantryItem[] {
  const existingIndex = items.findIndex((currentItem) => currentItem.id === item.id);

  if (existingIndex === -1) return [item, ...items];

  return items.map((currentItem) => (currentItem.id === item.id ? item : currentItem));
}

type PantryState = {
  items: PantryItem[];
  removeItems: (itemIds: string[]) => void;
  upsertItem: (item: PantryItem) => void;
};

export const usePantryStore = create<PantryState>((set) => ({
  items: pantryItems,
  removeItems: (itemIds) => set((state) => ({ items: removePantryItems(state.items, itemIds) })),
  upsertItem: (item) => set((state) => ({ items: upsertPantryItem(state.items, item) })),
}));
