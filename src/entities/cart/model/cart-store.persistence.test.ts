import type { StateStorage } from 'zustand/middleware';
import { describe, expect, it } from 'vitest';

const storageValues = new Map<string, string>();

const storageMock: StateStorage = {
  getItem: (key: string) => storageValues.get(key) ?? null,
  removeItem: (key: string) => storageValues.delete(key),
  setItem: (key: string, value: string) => storageValues.set(key, value),
};

describe('cart persistence', () => {
  it('restores recipe ingredients after a new store instance is created', async () => {
    storageValues.clear();
    const { createCartStore } = await import('./cart-store');
    const recipeIngredient = {
      id: 'recipe-ingredient:tomato',
      ingredient: '토마토',
      name: '토마토 (상품 연결 전)',
      price: 0,
      purchasable: false,
    };

    const cartStore = createCartStore(storageMock);
    cartStore.getState().addProducts([recipeIngredient]);
    expect(storageValues.has('ai-pantry:cart')).toBe(true);

    const reloadedCartStore = createCartStore(storageMock);
    await reloadedCartStore.persist.rehydrate();

    expect(reloadedCartStore.getState().items).toEqual([{ ...recipeIngredient, quantity: 1 }]);
  });
});
