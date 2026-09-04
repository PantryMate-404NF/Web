/**
 * 공통 HTTP 요청 함수가 인증 헤더를 올바르게 구성하고,
 * 서버 응답의 data를 호출자에게 반환하는지 검증합니다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { setAccessToken } from '@/shared/model/access-token-store';

import { request } from './http-client';

describe('request', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setAccessToken('');
  });

  it('Access Token을 Bearer Authorization 헤더로 전송한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'SUCCESS',
          message: '조회에 성공했습니다.',
          data: { pantryId: 1 },
          error: null,
          timestamp: '2026-09-04T00:00:00Z',
        }),
        { status: 200 },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);
    setAccessToken('access-token');

    await expect(request<{ pantryId: number }>('/api/pantries')).resolves.toEqual({
      pantryId: 1,
    });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token');
  });
});
