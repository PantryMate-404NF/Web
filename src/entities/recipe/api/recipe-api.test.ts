import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('recipe API', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'SUCCESS',
            message: '성공',
            data: [],
            error: null,
            timestamp: '2026-09-17T00:00:00Z',
          }),
        ),
      ),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('레시피 목록 요청에 로그인 access token을 전달한다', async () => {
    const { setAccessToken } = await import('@/shared/model/access-token-store');
    const { getRecipes } = await import('./get-recipes');
    setAccessToken('access-token');

    await getRecipes();

    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token');
  });

  it('스크랩 목록을 명세된 경로에서 가져온다', async () => {
    const { setAccessToken } = await import('@/shared/model/access-token-store');
    const { getScrappedRecipes } = await import('./get-scrapped-recipes');
    setAccessToken('access-token');

    await expect(getScrappedRecipes()).resolves.toEqual([]);

    const [url, options] = vi.mocked(fetch).mock.calls.at(-1) as [string, RequestInit];
    expect(url).toBe('http://localhost:3000/api/recipes/scraps');
    expect(options.method ?? 'GET').toBe('GET');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token');
  });
});
