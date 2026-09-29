import { describe, expect, it } from 'vitest';

import { pantryItems } from './mock';
import { useRecipePantrySelectionStore } from './recipe-pantry-selection-store';

describe('recipe pantry selection', () => {
  it('toggles selected pantry cards and keeps the recipe ingredient ID for filtering', () => {
    const store = useRecipePantrySelectionStore.getState();
    store.beginSelection();
    store.toggleSelection(pantryItems[0], 21);

    expect(useRecipePantrySelectionStore.getState()).toMatchObject({
      isSelectingForRecipe: true,
      selectedPantryItemIds: [pantryItems[0].id],
      selectedIngredientIdsByPantryItemId: { [pantryItems[0].id]: 21 },
    });

    useRecipePantrySelectionStore.getState().toggleSelection(pantryItems[0], 21);
    expect(useRecipePantrySelectionStore.getState().selectedPantryItemIds).toEqual([]);
  });

  it('limits selection to three pantry items', () => {
    const store = useRecipePantrySelectionStore.getState();
    store.beginSelection();
    pantryItems.slice(0, 4).forEach((item, index) => store.toggleSelection(item, index + 1));

    expect(useRecipePantrySelectionStore.getState().selectedPantryItemIds).toEqual(
      pantryItems.slice(0, 3).map((item) => item.id),
    );
  });

  it('can resume recipe selection mode after the pantry page is reloaded', () => {
    const store = useRecipePantrySelectionStore.getState();
    store.clearSelection();
    store.resumeSelection();

    expect(useRecipePantrySelectionStore.getState().isSelectingForRecipe).toBe(true);
  });

  it('allows a pantry item marked unavailable when it has a recipe ingredient ID', () => {
    const store = useRecipePantrySelectionStore.getState();
    const unavailableItem = { ...pantryItems[0], availability: 'UNAVAILABLE' as const };
    store.beginSelection();
    store.toggleSelection(unavailableItem, 77);

    expect(useRecipePantrySelectionStore.getState()).toMatchObject({
      selectedPantryItemIds: [unavailableItem.id],
      selectedIngredientIdsByPantryItemId: { [unavailableItem.id]: 77 },
    });
  });

  it('allows selecting a pantry item even before it can be matched to a recipe ingredient ID', () => {
    const store = useRecipePantrySelectionStore.getState();
    store.beginSelection();
    store.toggleSelection({ ...pantryItems[0], ingredientId: null }, undefined);

    expect(useRecipePantrySelectionStore.getState()).toMatchObject({
      selectedPantryItemIds: [pantryItems[0].id],
      selectedIngredientIdsByPantryItemId: {},
    });
  });
});
