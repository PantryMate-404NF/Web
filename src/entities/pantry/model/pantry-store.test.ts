import { describe, expect, it } from 'vitest';

import { pantryItems } from './mock';
import type { PantryItem } from './types';

const storageItems: PantryItem[] = [
  {
    ...pantryItems[0],
    id: 'fridge',
    storageType: 'REFRIGERATED',
    createdAt: '2026-09-03T00:00:00Z',
  },
  { ...pantryItems[1], id: 'frozen', storageType: 'FROZEN', createdAt: '2026-09-01T00:00:00Z' },
  { ...pantryItems[2], id: 'room', storageType: 'ROOMTEMP', createdAt: '2026-09-02T00:00:00Z' },
];

describe('removePantryItems', () => {
  it('removes only the items confirmed by the user', async () => {
    const pantryStore = await import('./pantry-' + 'store').catch(() => undefined);
    const remainingItems = pantryStore?.removePantryItems(pantryItems, ['egg', 'milk']);

    expect(remainingItems).toEqual(
      pantryItems.filter((item) => item.id !== 'egg' && item.id !== 'milk'),
    );
  });
});

describe('filterPantryItems', () => {
  it('filters pantry items by storage type', async () => {
    const pantryStore = await import('./pantry-' + 'store');

    expect(pantryStore.filterPantryItems(storageItems, 'REFRIGERATED')).toEqual([storageItems[0]]);
  });
});

describe('sortPantryItems', () => {
  it('sorts items by oldest registration first', async () => {
    const pantryStore = await import('./pantry-' + 'store');

    expect(pantryStore.sortPantryItems(storageItems, 'OLDEST')).toEqual([
      storageItems[1],
      storageItems[2],
      storageItems[0],
    ]);
  });
});

describe('upsertPantryItem', () => {
  it('replaces an item with the same id and keeps the rest', async () => {
    const pantryStore = await import('./pantry-' + 'store');
    const updated = pantryStore.upsertPantryItem(storageItems, {
      ...storageItems[0],
      name: '쪽파',
    });

    expect(updated).toHaveLength(storageItems.length);
    expect(updated[0].name).toBe('쪽파');
  });
});
