/**
 * 공통 HTTP 요청 함수가 인증 헤더를 올바르게 구성하고,
 * 서버 응답의 data를 호출자에게 반환하는지 검증합니다.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('request', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8080');
    vi.resetModules();
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    const { clearAccessToken } = await import('@/shared/model/access-token-store');

    clearAccessToken();
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
    const { setAccessToken } = await import('@/shared/model/access-token-store');
    const { request } = await import('./http-client');

    setAccessToken('access-token');

    await expect(request<{ pantryId: number }>('/api/pantries')).resolves.toEqual({
      pantryId: 1,
    });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token');
  });

  it('비JSON 오류 응답을 ApiError로 변환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Bad Gateway', { status: 502 })));
    const { ApiError } = await import('./api-error');
    const { request } = await import('./http-client');
    const error = await request('/api/pantries').catch((caughtError: unknown) => caughtError);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 502,
      message: '서버 응답을 해석하지 못했습니다.',
    });
  });
});
