/** 수기 등록 폼 값을 Swagger 팬트리 요청 본문으로 변환함 */

import type { CreatePantryItemRequest, UpdatePantryItemRequest } from './pantry.dto';

export interface PantryItemFormValues {
  consumptionDate: string;
  expirationDate: string;
  imageUrl: string;
  name: string;
  storageType: CreatePantryItemRequest['storageType'];
}

function getServerImageUrl(imageUrl: string) {
  return imageUrl.startsWith('https://') || imageUrl.startsWith('http://') ? imageUrl : undefined;
}

export function toCreatePantryItemRequest(values: PantryItemFormValues): CreatePantryItemRequest {
  return {
    ingredientName: values.name.trim(),
    sellByDate: values.expirationDate || undefined,
    expiryDate: values.consumptionDate || undefined,
    storageType: values.storageType,
    imageUrl: getServerImageUrl(values.imageUrl),
  };
}

export function toUpdatePantryItemRequest(values: PantryItemFormValues): UpdatePantryItemRequest {
  return toCreatePantryItemRequest(values);
}
