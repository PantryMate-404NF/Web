/**
 * 개발·테스트 환경의 팬트리 API 응답 목업 데이터 제공함
 */

import type { PantryItemDto } from '@/entities/pantry/api/pantry.dto';
import type { ApiSuccessResponse } from '@/shared/api/api-response';

export const pantryListResponse: ApiSuccessResponse<PantryItemDto[]> = {
  status: 'SUCCESS' as const,
  message: '팬트리 목록을 조회했습니다.',
  data: [
    {
      pantryItemId: 1,
      ingredientName: '대파',
      sellByDate: null,
      expiryDate: '2026-09-07',
      dDay: 3,
      expiryStatus: 'IMMINENT',
      storageType: 'REFRIGERATED' as const,
      isExpiryAutoCalculated: false,
      isCookable: true,
      registerType: 'MANUAL' as const,
      imageUrl: null,
    },
  ],
  error: null,
  timestamp: '2026-09-07T00:00:00Z',
};
