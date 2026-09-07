/**
 * 백엔드 팬트리 응답을 화면에서 사용하는 PantryItem으로 변환.
 * 소비기한 상태와 표시 문구를 이 파일에서 일관되게 결정.
 */

import type { PantryItem } from '../model/types';
import type { PantryDto } from './pantry.dto';

export function toPantryItem(dto: PantryDto): PantryItem {
  const expirationStatus = dto.isExpired
    ? 'EXPIRED'
    : dto.isImminent
      ? 'IMMINENT'
      : dto.dDay === null
        ? 'UNREGISTERED'
        : 'NORMAL';

  const expirationLabel = dto.isExpired
    ? '소비기한 경과'
    : dto.dDay === 0
      ? '소비기한 오늘까지'
      : dto.dDay === null
        ? '소비기한 미등록'
        : `소비기한 ${dto.dDay}일 남음`;

  return {
    id: String(dto.pantryId),
    name: dto.ingredientName,
    expirationLabel,
    expirationStatus,
    // Swagger에 없는 화면 전용 상태. 필요 여부를 BE와 협의해야 함.
    availability: 'AVAILABLE',
    imageAlt: `${dto.ingredientName} 이미지`,
    imageUrl: dto.imageUrl ?? undefined,
  };
}
