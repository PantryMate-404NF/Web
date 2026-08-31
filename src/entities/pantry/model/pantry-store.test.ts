import { describe, expect, it } from 'vitest';

import { pantryItems } from './mock';

describe('removePantryItems', () => {
  it('removes only the items confirmed by the user', async () => {
    const pantryStore = await import('./pantry-' + 'store').catch(() => undefined);
    const remainingItems = pantryStore?.removePantryItems(pantryItems, ['egg', 'milk']);

    expect(remainingItems).toEqual(
      pantryItems.filter((item) => item.id !== 'egg' && item.id !== 'milk'),
    );
  });
});
