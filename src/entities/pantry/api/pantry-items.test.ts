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

  it('목록 검색어를 keyword query parameter로 전송한다', async () => {
    const { getPantries } = await import('./get-pantries');

    await getPantries({ keyword: '양파' });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/pantry-items?keyword=%EC%96%91%ED%8C%8C',
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

  it('이미지를 multipart 파일로 업로드하고 서버가 반환한 URL을 받는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'SUCCESS',
            message: '성공',
            data: { imageUrl: 'http://localhost:8080/api/pantry-items/images/tomato.jpg' },
            error: null,
            timestamp: '2026-09-29T00:00:00Z',
          }),
        ),
      ),
    );
    const { uploadPantryImage } = await import('./upload-pantry-image');
    const { setAccessToken } = await import('@/shared/model/access-token-store');
    const file = new File(['image'], 'tomato.png', { type: 'image/png' });
    setAccessToken('access-token');

    await expect(uploadPantryImage(file)).resolves.toEqual({
      imageUrl: 'http://localhost:8080/api/pantry-items/images/tomato.jpg',
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/pantry-items/images',
      expect.objectContaining({ method: 'POST' }),
    );
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('file')).toBe(file);
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token');
    expect(new Headers(options.headers).has('Content-Type')).toBe(false);
  });

  it('영수증과 receiptId를 multipart로 전송하고 snake_case OCR 응답을 받는다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            receipt_id: 'receipt-123',
            purchased_at: '2026-09-29',
            items: [{ name: '계란', ingredient_id: null }],
          }),
        ),
      ),
    );
    const { recognizeReceipt } = await import('./recognize-receipt');
    const { setAccessToken } = await import('@/shared/model/access-token-store');
    const file = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
    setAccessToken('access-token');

    await expect(recognizeReceipt(file, 'receipt-123', 'trace-123')).resolves.toEqual({
      receiptId: 'receipt-123',
      purchasedAt: '2026-09-29',
      items: [{ name: '계란', ingredientId: null }],
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/pantry-items/receipts',
      expect.objectContaining({ method: 'POST' }),
    );
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('file')).toBe(file);
    expect((options.body as FormData).get('receiptId')).toBe('receipt-123');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token');
    expect(new Headers(options.headers).get('X-Request-Id')).toBe('trace-123');
    expect(new Headers(options.headers).has('Content-Type')).toBe(false);
  });

  it('OCR 실패 응답의 코드를 화면 처리에 사용할 수 있도록 보존한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            receipt_id: 'receipt-123',
            purchased_at: null,
            items: [],
            error: { code: 'OCR_EMPTY', message: '영수증을 인식하지 못했습니다.' },
          }),
          { status: 500 },
        ),
      ),
    );
    const { recognizeReceipt } = await import('./recognize-receipt');

    await expect(
      recognizeReceipt(
        new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' }),
        'receipt-123',
        'trace-123',
      ),
    ).rejects.toMatchObject({
      code: 'OCR_EMPTY',
      message: '영수증을 인식하지 못했습니다.',
    });
  });
});
