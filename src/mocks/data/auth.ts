/**
 * 개발·테스트 환경에서 POST /api/auth/reissue 응답으로 사용하는 인증 목업 데이터입니다.
 */

export const reissueAccessTokenResponse = {
  status: 'SUCCESS' as const,
  message: 'Access Token이 재발급되었습니다.',
  data: {
    accessToken: 'mock-access-token',
  },
  error: null,
  timestamp: '2026-09-07T00:00:00Z',
};
