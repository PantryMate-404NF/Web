/**
 * Refresh Token 쿠키를 사용해 Access Token을 재발급을 받는다.
 * 발급된 Access Token은 브라우저 메모리에만 보관.
 */

import { request } from '@/shared/api/http-client';
import { setAccessToken } from '@/shared/model/access-token-store';

interface ReissueAccessTokenResponse {
  accessToken: string;
}

export async function reissueAccessToken() {
  const data = await request<ReissueAccessTokenResponse>('/api/auth/reissue', {
    method: 'POST',
    auth: false,
    credentials: 'include',
  });

  setAccessToken(data.accessToken);

  return data.accessToken;
}
