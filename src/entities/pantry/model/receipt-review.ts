import type { PantryStorageType } from './types';

export interface ReceiptReviewItem {
  consumptionDate: string;
  expirationDate: string;
  imageFile?: File;
  imagePreviewUrl?: string;
  id: string;
  name: string;
  purchaseDate?: string;
  storageType: PantryStorageType | null;
}

export function createReceiptReviewItem(
  id: string,
  name: string,
  purchaseDate?: string,
): ReceiptReviewItem {
  return {
    consumptionDate: '',
    expirationDate: '',
    id,
    imageFile: undefined,
    imagePreviewUrl: undefined,
    name,
    ...(purchaseDate ? { purchaseDate } : {}),
    storageType: null,
  };
}

export function areReceiptReviewItemsSubmittable(
  items: Array<Pick<ReceiptReviewItem, 'name' | 'storageType'>>,
) {
  return (
    items.length > 0 &&
    items.every(({ name, storageType }) => name.trim().length > 0 && storageType !== null)
  );
}
