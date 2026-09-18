import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function toggleScrappedRecipeId(recipeIds: string[], recipeId: string): string[] {
  return recipeIds.includes(recipeId)
    ? recipeIds.filter((savedRecipeId) => savedRecipeId !== recipeId)
    : [...recipeIds, recipeId];
}

type ScrappedRecipeState = {
  hasHydrated: boolean;
  markHydrated: () => void;
  scrappedRecipeIds: string[];
  toggleScrap: (recipeId: string) => void;
};

export const scrappedRecipeStorageKey = 'ai-pantry:scrapped-recipes';

export const selectScrappedRecipeIds = (state: ScrappedRecipeState) => state.scrappedRecipeIds;

export const useScrappedRecipeStore = create<ScrappedRecipeState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      markHydrated: () => set({ hasHydrated: true }),
      scrappedRecipeIds: [],
      toggleScrap: (recipeId) =>
        set((state) => ({
          scrappedRecipeIds: toggleScrappedRecipeId(state.scrappedRecipeIds, recipeId),
        })),
    }),
    {
      name: scrappedRecipeStorageKey,
      onRehydrateStorage: () => (state) => state?.markHydrated(),
      partialize: ({ scrappedRecipeIds }) => ({ scrappedRecipeIds }),
      skipHydration: true,
    },
  ),
);
