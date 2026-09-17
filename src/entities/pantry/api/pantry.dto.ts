/**
 * Swagger 팬트리 API 요청과 응답 타입 정의함
 */

export type PantryStorageType = 'REFRIGERATED' | 'FROZEN' | 'ROOM_TEMP';
export type PantryExpiryStatus = 'NORMAL' | 'IMMINENT' | 'EXPIRED';

export interface PantryItemDto {
  /** 팬트리 식재료 항목의 고유 식별자입니다. */
  pantryItemId: number;
  /** 사용자가 직접 등록했거나 OCR로 인식한 식재료명입니다. */
  ingredientName: string;
  /** 소비기한 날짜입니다. 소비기한을 등록하지 않은 경우 null입니다. */
  sellByDate: string | null;
  expiryDate: string | null;
  /** 소비기한까지 남은 일수입니다. 소비기한 미등록 시 null입니다. */
  dDay: number | null;
  expiryStatus: PantryExpiryStatus;
  /** 식재료의 보관 위치 또는 보관 방식입니다. */
  storageType: PantryStorageType;
  isExpiryAutoCalculated: boolean;
  isCookable: boolean;
  registerType: string;
  /** 식재료 이미지 주소입니다. 이미지가 없으면 null입니다. */
  imageUrl: string | null;
}

export interface CreatePantryItemRequest {
  ingredientName: string;
  sellByDate?: string;
  expiryDate?: string;
  storageType: PantryStorageType;
  imageUrl?: string;
}

export interface UpdatePantryItemRequest extends Partial<CreatePantryItemRequest> {
  cookable?: boolean;
}
