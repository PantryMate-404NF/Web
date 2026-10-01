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

export const PAYMENT_ATTEMPT_STORAGE_KEY = 'order-payment-attempt';

interface StorageRemover {
  removeItem: (key: string) => void;
}

interface ClearAccountClientStateOptions {
  localStorage?: StorageRemover;
  sessionStorage?: StorageRemover;
}

function removeStoredValue(storage: StorageRemover | undefined, key: string) {
  try {
    storage?.removeItem(key);
  } catch {
    // Storage 접근 실패가 이미 완료된 회원 탈퇴 후처리를 막지 않게 합니다.
  }
}

function getStorage(storage: () => StorageRemover | undefined) {
  try {
    return storage();
  } catch {
    return undefined;
  }
}

/** 다른 계정에 노출되면 안 되는 현재 사용자의 브라우저 상태를 제거합니다. */
export function clearAccountClientState(options: ClearAccountClientStateOptions = {}) {
  useCartStore.setState({ items: [] });
  useFavoriteProductStore.setState({ favoriteProductIds: [] });
  usePantryStore.setState({ items: [] });
  useRecipePantrySelectionStore.setState({
    isSelectingForRecipe: false,
    selectedPantryItemIds: [],
    selectedIngredientIdsByPantryItemId: {},
  });

  const localStorage = getStorage(
    () => options.localStorage ?? (typeof window === 'undefined' ? undefined : window.localStorage),
  );
  const sessionStorage = getStorage(
    () =>
      options.sessionStorage ?? (typeof window === 'undefined' ? undefined : window.sessionStorage),
  );

  removeStoredValue(localStorage, cartStorageKey);
  removeStoredValue(localStorage, favoriteProductStorageKey);
  removeStoredValue(localStorage, PANTRY_REMINDER_STORAGE_KEY);
  removeStoredValue(sessionStorage, PAYMENT_ATTEMPT_STORAGE_KEY);
  removeStoredValue(sessionStorage, RECIPE_PANTRY_SELECTION_INTENT_KEY);
}
