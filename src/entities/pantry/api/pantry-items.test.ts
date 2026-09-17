import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('pantry item API', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8080');
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'SUCCESS',
            message: '성공',
            data: {},
            error: null,
            timestamp: '2026-09-17T00:00:00Z',
          }),
        ),
      ),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('목록 필터와 정렬을 Swagger query string으로 전송한다', async () => {
    const { getPantries } = await import('./get-pantries');

    await getPantries({ storageType: 'FROZEN', sort: 'IMMINENT' });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/pantry-items?storageType=FROZEN&sort=IMMINENT',
      expect.anything(),
    );
  });

  it('선택한 팬트리 항목을 단건 삭제한다', async () => {
    const { deletePantryItem } = await import('./delete-pantry-item');

    await deletePantryItem('12');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/pantry-items/12',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
