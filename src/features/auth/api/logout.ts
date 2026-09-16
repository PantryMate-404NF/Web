/** 서버의 Refresh Token을 만료시키고 메모리 Access Token을 제거합니다. */

import { request } from '@/shared/api/http-client';
import { clearAccessToken } from '@/shared/model/access-token-store';

export async function logout() {
  await request('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    responseType: 'none',
  });

  clearAccessToken();
}
