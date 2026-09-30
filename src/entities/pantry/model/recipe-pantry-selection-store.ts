import { create } from 'zustand';

import type { PantryItem } from './types';

export const MAX_RECIPE_PANTRY_SELECTION = 3;
export const RECIPE_PANTRY_SELECTION_INTENT_KEY = 'pantry-recipe-selection-intent';

interface RecipePantrySelectionState {
  isSelectingForRecipe: boolean;
  selectedPantryItemIds: string[];
  selectedIngredientIdsByPantryItemId: Record<string, number>;
  beginSelection: (
    selection?: Array<{ pantryItemId: string; ingredientId?: number | null }>,
  ) => void;
  resumeSelection: () => void;
  toggleSelection: (item: PantryItem, ingredientId?: number) => void;
  clearSelection: () => void;
}

export const useRecipePantrySelectionStore = create<RecipePantrySelectionState>((set) => ({
  isSelectingForRecipe: false,
  selectedPantryItemIds: [],
  selectedIngredientIdsByPantryItemId: {},
  beginSelection: (selection = []) => {
    const selectedItems = selection.slice(0, MAX_RECIPE_PANTRY_SELECTION);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(RECIPE_PANTRY_SELECTION_INTENT_KEY, '1');
    }
    set({
      isSelectingForRecipe: true,
      selectedPantryItemIds: selectedItems.map(({ pantryItemId }) => pantryItemId),
      selectedIngredientIdsByPantryItemId: Object.fromEntries(
        selectedItems.flatMap(({ pantryItemId, ingredientId }) =>
          ingredientId == null ? [] : [[pantryItemId, ingredientId]],
        ),
      ),
    });
  },
  resumeSelection: () => set({ isSelectingForRecipe: true }),
  toggleSelection: (item, resolvedIngredientId) =>
    set((state) => {
      const ingredientId = resolvedIngredientId ?? item.ingredientId;

      if (state.selectedPantryItemIds.includes(item.id)) {
        const remainingIngredientIds = { ...state.selectedIngredientIdsByPantryItemId };
        delete remainingIngredientIds[item.id];
        return {
          selectedPantryItemIds: state.selectedPantryItemIds.filter((id) => id !== item.id),
          selectedIngredientIdsByPantryItemId: remainingIngredientIds,
        };
      }

      if (state.selectedPantryItemIds.length >= MAX_RECIPE_PANTRY_SELECTION) return state;

      const selectedIngredientIdsByPantryItemId = {
        ...state.selectedIngredientIdsByPantryItemId,
      };
      if (ingredientId != null) {
        selectedIngredientIdsByPantryItemId[item.id] = ingredientId;
      }

      return {
        selectedPantryItemIds: [...state.selectedPantryItemIds, item.id],
        selectedIngredientIdsByPantryItemId,
      };
    }),
  clearSelection: () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(RECIPE_PANTRY_SELECTION_INTENT_KEY);
    }
    set({
      isSelectingForRecipe: false,
      selectedPantryItemIds: [],
      selectedIngredientIdsByPantryItemId: {},
    });
  },
}));

export function consumeRecipePantrySelectionIntent() {
  if (typeof window === 'undefined') return false;
  const hasIntent = window.sessionStorage.getItem(RECIPE_PANTRY_SELECTION_INTENT_KEY) === '1';
  if (hasIntent) window.sessionStorage.removeItem(RECIPE_PANTRY_SELECTION_INTENT_KEY);
  return hasIntent;
}
