import type { CreatePantryItemRequest } from '@/entities/pantry/api/pantry.dto';
import type { ProductDetailDto } from '@/entities/product/api/product.dto';
import { isProductStorageType } from '@/entities/product/model/types';

interface PurchasedItem {
  id: string;
  name: string;
  productId?: number;
}

interface RegisterPurchasedItemsDependencies {
  createPantryItem: (payload: CreatePantryItemRequest) => Promise<unknown>;
  getProductDetail: (productId: number) => Promise<ProductDetailDto>;
  storage: Pick<Storage, 'getItem' | 'setItem'>;
}

export interface RegisterPurchasedItemsResult {
  failedItems: PantryRegistrationFailure[];
  registeredCount: number;
}

export type PantryRegistrationFailureReason =
  | 'missing-product-id'
  | 'product-detail-request'
  | 'missing-product-name'
  | 'missing-storage-type'
  | 'pantry-create-request';

export interface PantryRegistrationFailure {
  itemId: string;
  itemName: string;
  reason: PantryRegistrationFailureReason;
}

function getRegistrationStorageKey(orderId: string) {
  return `ai-pantry:registered-purchase-items:${orderId}`;
}

function readRegisteredItemIds(storage: Pick<Storage, 'getItem'>, key: string) {
  try {
    const value: unknown = JSON.parse(storage.getItem(key) ?? '[]');
    return new Set(
      Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [],
    );
  } catch {
    return new Set<string>();
  }
}

export async function registerPurchasedItemsInPantry(
  orderId: string,
  items: PurchasedItem[],
  { createPantryItem, getProductDetail, storage }: RegisterPurchasedItemsDependencies,
): Promise<RegisterPurchasedItemsResult> {
  const storageKey = getRegistrationStorageKey(orderId);
  const registeredItemIds = readRegisteredItemIds(storage, storageKey);
  const failedItems: PantryRegistrationFailure[] = [];
  let registeredCount = 0;

  function fail(item: PurchasedItem, reason: PantryRegistrationFailureReason) {
    failedItems.push({ itemId: item.id, itemName: item.name, reason });
  }

  for (const item of items) {
    if (registeredItemIds.has(item.id)) continue;

    const productId = item.productId;
    if (typeof productId !== 'number' || !Number.isSafeInteger(productId) || productId <= 0) {
      fail(item, 'missing-product-id');
      continue;
    }

    let product: ProductDetailDto;
    try {
      product = await getProductDetail(productId);
    } catch {
      fail(item, 'product-detail-request');
      continue;
    }

    if (!product.name.trim()) {
      fail(item, 'missing-product-name');
      continue;
    }

    if (!isProductStorageType(product.storageType)) {
      fail(item, 'missing-storage-type');
      continue;
    }

    try {
      await createPantryItem({
        ingredientName: product.name,
        ...(product.thumbnailUrl ? { imageUrl: product.thumbnailUrl } : {}),
        registerType: 'AUTO',
        storageType: product.storageType,
      });

      registeredItemIds.add(item.id);
      registeredCount += 1;

      try {
        storage.setItem(storageKey, JSON.stringify([...registeredItemIds]));
      } catch {
        // Pantry registration should remain successful if session storage is unavailable.
      }
    } catch {
      fail(item, 'pantry-create-request');
    }
  }

  return { failedItems, registeredCount };
}
