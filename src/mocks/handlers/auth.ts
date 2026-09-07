/**
 * 인증 API의 MSW 목업 응답을 정의.
 * 실제 OAuth 리다이렉트는 백엔드가 담당하므로,
 * FE가 호출하는 Access Token 재발급 API만 목업
 */
import { http, HttpResponse } from 'msw';

import { reissueAccessTokenResponse } from '../data/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const authHandlers = [
  http.post(`${API_BASE_URL}/api/auth/reissue`, () => {
    return HttpResponse.json(reissueAccessTokenResponse);
  }),
];
