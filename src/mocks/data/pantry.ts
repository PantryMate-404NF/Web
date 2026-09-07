/**
 * 개발·테스트 환경에서 GET /api/pantries 응답으로 사용하는 팬트리 목업 데이터.
 */

export const pantryListResponse = {
  status: 'SUCCESS' as const,
  message: '팬트리 목록을 조회했습니다.',
  data: [
    {
      pantryId: 1,
      ingredientName: '대파',
      expirationDate: '2026-09-07',
      dDay: 3,
      isImminent: true,
      isExpired: false,
      storageType: 'REFRIGERATED' as const,
      registerType: 'MANUAL' as const,
      imageUrl: null,
      createdAt: '2026-09-04T00:00:00Z',
    },
  ],
  error: null,
  timestamp: '2026-09-07T00:00:00Z',
};
