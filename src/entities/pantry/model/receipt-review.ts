import type { PantryStorageType } from './types';

export interface ReceiptReviewItem {
  consumptionDate: string;
  expirationDate: string;
  imageFile?: File;
  imagePreviewUrl?: string;
  id: string;
  name: string;
  storageType: PantryStorageType | null;
}

export function createReceiptReviewItem(id: string, name: string): ReceiptReviewItem {
  return {
    consumptionDate: '',
    expirationDate: '',
    id,
    imageFile: undefined,
    imagePreviewUrl: undefined,
    name,
    storageType: null,
  };
}

export function areReceiptReviewItemsSubmittable(
  purchaseDate: string,
  items: Array<Pick<ReceiptReviewItem, 'name' | 'storageType'>>,
) {
  return (
    Boolean(purchaseDate) &&
    items.length > 0 &&
    items.every(({ name, storageType }) => name.trim().length > 0 && storageType !== null)
  );
}
