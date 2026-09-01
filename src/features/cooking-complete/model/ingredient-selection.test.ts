import { describe, expect, it } from 'vitest';

describe('ingredient selection', () => {
  it('toggles one ingredient without changing other selections', async () => {
    const selection = await import('./ingredient-' + 'selection').catch(() => undefined);

    expect(selection?.toggleSelectedIngredient(['egg'], 'milk')).toEqual(['egg', 'milk']);
  });

  it('selects every available ingredient when none are selected', async () => {
    const selection = await import('./ingredient-' + 'selection').catch(() => undefined);

    expect(selection?.toggleAllIngredients(['egg', 'milk'], [])).toEqual(['egg', 'milk']);
  });

  it('clears every selection when all ingredients are already selected', async () => {
    const selection = await import('./ingredient-' + 'selection').catch(() => undefined);

    expect(selection?.toggleAllIngredients(['egg', 'milk'], ['egg', 'milk'])).toEqual([]);
  });
});
