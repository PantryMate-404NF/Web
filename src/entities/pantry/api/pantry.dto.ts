/**
 * 백엔드 팬트리 API와 주고받는 원본 데이터 형식.
 * UI에서 쓰는 PantryItem과 분리해 API 변경 영향을 제한.
 */

export type PantryStorageType = 'REFRIGERATED' | 'FROZEN' | 'ROOMTEMP';

export interface PantryDto {
  /** 팬트리 식재료 항목의 고유 식별자입니다. */
  pantryId: number;
  /** 사용자가 직접 등록했거나 OCR로 인식한 식재료명입니다. */
  ingredientName: string;
  /** 소비기한 날짜입니다. 소비기한을 등록하지 않은 경우 null입니다. */
  expirationDate: string | null;
  /** 소비기한까지 남은 일수입니다. 소비기한 미등록 시 null입니다. */
  dDay: number | null;
  /** 소비기한 임박 기준에 해당하는지 여부입니다. */
  isImminent: boolean;
  /** 소비기한이 지난 식재료인지 여부입니다. */
  isExpired: boolean;
  /** 식재료의 보관 위치 또는 보관 방식입니다. */
  storageType: PantryStorageType;
  /** 식재료 등록 방식입니다. MANUAL은 직접 등록, OCR은 영수증 인식 등록입니다. */
  registerType: 'MANUAL' | 'OCR';
  /** 식재료 이미지 주소입니다. 이미지가 없으면 null입니다. */
  imageUrl: string | null;
  /** 팬트리 항목이 생성된 시각입니다. ISO 8601 문자열 형식을 사용합니다. */
  createdAt: string;
}

export interface CreatePantryRequestDto {
  ingredientName: string;
  expirationDate: string;
  storageType: PantryStorageType;
  imageUrl: string | null;
}
