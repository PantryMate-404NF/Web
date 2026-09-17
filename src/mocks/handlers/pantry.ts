/**
 * 개발 환경에서 팬트리 API 응답을 재현하는 MSW 핸들러임
 */

import { http, HttpResponse } from 'msw';

import type { ApiErrorResponse } from '@/shared/api/api-response';

import { pantryListResponse } from '../data/pantry';

const pantryUnauthorizedResponse: ApiErrorResponse = {
  status: 'ERROR',
  message: '인증 정보가 유효하지 않습니다.',
  data: null,
  error: 'UNAUTHORIZED',
  timestamp: '2026-09-07T00:00:00Z',
};

export const pantryHandlers = [
  http.get('*/api/pantry-items', ({ request }) => {
    const mock = new URL(request.url).searchParams.get('mock');

    if (mock === 'empty') {
      return HttpResponse.json({ ...pantryListResponse, data: [] });
    }

    if (mock === 'unauthorized') {
      return HttpResponse.json(pantryUnauthorizedResponse, { status: 401 });
    }

    if (mock === 'error') {
      return HttpResponse.json(
        {
          status: 'ERROR',
          message: '일시적인 오류가 발생했습니다.',
          data: null,
          error: 'SYS-INTERNAL-ERROR',
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    return HttpResponse.json(pantryListResponse);
  }),
];
