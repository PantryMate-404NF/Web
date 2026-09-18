import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ProductId } from './types';

export function toggleFavoriteProductId(
  productIds: ProductId[],
  productId: ProductId,
): ProductId[] {
  return productIds.includes(productId)
    ? productIds.filter((savedProductId) => savedProductId !== productId)
    : [...productIds, productId];
}

export type FavoriteProductState = {
  favoriteProductIds: ProductId[];
  hasHydrated: boolean;
  markHydrated: () => void;
  toggleFavorite: (productId: ProductId) => void;
};

export const favoriteProductStorageKey = 'ai-pantry:favorite-products';

export const selectFavoriteProductIds = (state: FavoriteProductState) => state.favoriteProductIds;

export const useFavoriteProductStore = create<FavoriteProductState>()(
  persist(
    (set) => ({
      favoriteProductIds: [],
      hasHydrated: false,
      markHydrated: () => set({ hasHydrated: true }),
      toggleFavorite: (productId) =>
        set((state) => ({
          favoriteProductIds: toggleFavoriteProductId(state.favoriteProductIds, productId),
        })),
    }),
    {
      name: favoriteProductStorageKey,
      onRehydrateStorage: () => (state) => state?.markHydrated(),
      partialize: ({ favoriteProductIds }) => ({ favoriteProductIds }),
      skipHydration: true,
    },
  ),
);
