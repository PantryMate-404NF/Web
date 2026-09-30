import { afterEach, describe, expect, it, vi } from 'vitest';

import { cartStorageKey, useCartStore } from '@/entities/cart/model/cart-store';
import { usePantryStore } from '@/entities/pantry/model/pantry-store';
import {
  RECIPE_PANTRY_SELECTION_INTENT_KEY,
  useRecipePantrySelectionStore,
} from '@/entities/pantry/model/recipe-pantry-selection-store';
import {
  favoriteProductStorageKey,
  useFavoriteProductStore,
} from '@/entities/product/model/favorite-store';
import { PANTRY_REMINDER_STORAGE_KEY } from '@/features/pantry-reminder/model/daily-pantry-reminder';

import { clearAccountClientState, PAYMENT_ATTEMPT_STORAGE_KEY } from './clear-account-client-state';

const cartItem = {
  id: 'product-1',
  ingredient: '달걀',
  name: '무항생제 달걀',
  price: 5900,
  quantity: 1,
};

describe('clearAccountClientState', () => {
  afterEach(() => {
    useCartStore.setState({ items: [] });
    useFavoriteProductStore.setState({ favoriteProductIds: [] });
    usePantryStore.setState({ items: [] });
    useRecipePantrySelectionStore.setState({
      isSelectingForRecipe: false,
      selectedPantryItemIds: [],
      selectedIngredientIdsByPantryItemId: {},
    });
  });

  it('계정별 메모리 상태와 브라우저 저장 값을 제거한다', () => {
    useCartStore.setState({ items: [cartItem] });
    useFavoriteProductStore.setState({ favoriteProductIds: ['free-range-eggs'] });
    usePantryStore.setState({
      items: [
        {
          id: 'pantry-1',
          name: '달걀',
          daysUntilExpiration: 3,
          storageType: 'REFRIGERATED',
          expirationStatus: 'NORMAL',
          expirationLabel: '소비기한 3일 남음',
          availability: 'AVAILABLE',
          imageAlt: '달걀',
        },
      ],
    });
    useRecipePantrySelectionStore.setState({
      isSelectingForRecipe: true,
      selectedPantryItemIds: ['pantry-1'],
      selectedIngredientIdsByPantryItemId: { 'pantry-1': 1 },
    });
    const localStorage = { removeItem: vi.fn() };
    const sessionStorage = { removeItem: vi.fn() };

    clearAccountClientState({ localStorage, sessionStorage });

    expect(useCartStore.getState().items).toEqual([]);
    expect(useFavoriteProductStore.getState().favoriteProductIds).toEqual([]);
    expect(usePantryStore.getState().items).toEqual([]);
    expect(useRecipePantrySelectionStore.getState()).toMatchObject({
      isSelectingForRecipe: false,
      selectedPantryItemIds: [],
      selectedIngredientIdsByPantryItemId: {},
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith(cartStorageKey);
    expect(localStorage.removeItem).toHaveBeenCalledWith(favoriteProductStorageKey);
    expect(localStorage.removeItem).toHaveBeenCalledWith(PANTRY_REMINDER_STORAGE_KEY);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(PAYMENT_ATTEMPT_STORAGE_KEY);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(RECIPE_PANTRY_SELECTION_INTENT_KEY);
  });

  it('한 저장소 객체 접근이 차단되어도 다른 저장소 정리를 계속한다', () => {
    const sessionStorage = { removeItem: vi.fn() };
    const options = { sessionStorage } as Parameters<typeof clearAccountClientState>[0];
    Object.defineProperty(options, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });

    expect(() => clearAccountClientState(options)).not.toThrow();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith(PAYMENT_ATTEMPT_STORAGE_KEY);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(RECIPE_PANTRY_SELECTION_INTENT_KEY);
  });
});
