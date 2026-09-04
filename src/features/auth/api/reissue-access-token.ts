/**
 * Refresh Token 쿠키를 사용해 Access Token을 재발급받습니다.
 * 응답 토큰을 검증한 뒤 브라우저 메모리에만 보관합니다.
 */

import { request } from '@/shared/api/http-client';
import { setAccessToken } from '@/shared/model/access-token-store';

interface ReissueAccessTokenResponse {
  accessToken: string;
}

/** Refresh Token 쿠키로 Access Token을 재발급하고 메모리에 저장합니다. */
export async function reissueAccessToken() {
  const data = await request<ReissueAccessTokenResponse>('/api/auth/reissue', {
    method: 'POST',
    auth: false,
    credentials: 'include',
  });

  if (typeof data.accessToken !== 'string' || data.accessToken.trim().length === 0) {
    throw new Error('유효한 Access Token이 없습니다.');
  }

  setAccessToken(data.accessToken);

  return data.accessToken;
}
