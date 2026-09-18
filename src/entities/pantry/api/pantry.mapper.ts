/**
 * Swagger 팬트리 응답을 화면 모델로 변환함
 */

import type { PantryItem } from '../model/types';
import type { PantryItemDto } from './pantry.dto';

export function toPantryItem(dto: PantryItemDto): PantryItem {
  const expirationStatus = dto.expiryDate === null ? 'UNREGISTERED' : dto.expiryStatus;

  const expirationLabel =
    expirationStatus === 'EXPIRED'
      ? '소비기한 경과'
      : dto.dDay === 0
        ? '소비기한 오늘까지'
        : dto.dDay === null
          ? '소비기한 미등록'
          : `소비기한 ${dto.dDay}일 남음`;

  return {
    id: String(dto.pantryItemId),
    name: dto.ingredientName,
    daysUntilExpiration: dto.dDay,
    expirationLabel,
    expirationStatus,
    expirationDate: dto.sellByDate ?? undefined,
    consumptionDate: dto.expiryDate ?? undefined,
    availability: dto.isCookable ? 'AVAILABLE' : 'UNAVAILABLE',
    imageAlt: `${dto.ingredientName} 이미지`,
    imageUrl: dto.imageUrl ?? undefined,
    storageType: dto.storageType,
    registrationSource: dto.registerType as PantryItem['registrationSource'],
  };
}
