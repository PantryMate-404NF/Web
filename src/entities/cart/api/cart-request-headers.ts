import { getAuthenticatedUserId } from '@/shared/model/access-token-store';

export function getCartRequestHeaders() {
  const userId = getAuthenticatedUserId();

  if (!userId) {
    throw new Error('로그인 사용자 정보를 확인할 수 없습니다.');
  }

  return { 'X-User-Id': userId };
}
