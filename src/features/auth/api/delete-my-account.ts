import { request } from '@/shared/api/http-client';
import { clearAccessToken } from '@/shared/model/access-token-store';

/** 현재 회원을 영구 탈퇴시키고 메모리 인증 정보를 제거합니다. */
export async function deleteMyAccount() {
  await request('/api/users/me', {
    method: 'DELETE',
    responseType: 'none',
  });

  clearAccessToken();
}
