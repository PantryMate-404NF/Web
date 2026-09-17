import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('orderPaymentRequest', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID', '7');
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('주문 결제 프록시와 임시 사용자 헤더로 요청한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'SUCCESS',
          message: '조회 성공',
          data: { cartId: 1 },
          error: null,
          timestamp: '2026-09-17T00:00:00Z',
        }),
        { status: 200 },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);
    const { orderPaymentRequest } = await import('./order-payment-client');

    await expect(orderPaymentRequest<{ cartId: number }>('/carts')).resolves.toEqual({ cartId: 1 });

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe('http://localhost:3000/order-api/carts');
    expect(new Headers(options.headers).get('X-User-Id')).toBe('7');
  });

  it('서버 오류 코드와 상태를 ApiError로 보존한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'ERROR',
            message: '결제 금액이 일치하지 않습니다.',
            data: null,
            error: 'AMOUNT_MISMATCH',
            timestamp: '2026-09-17T00:00:00Z',
          }),
          { status: 400 },
        ),
      ),
    );
    const { ApiError } = await import('./api-error');
    const { orderPaymentRequest } = await import('./order-payment-client');

    const error = await orderPaymentRequest('/payments/confirm').catch(
      (caughtError: unknown) => caughtError,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, code: 'AMOUNT_MISMATCH' });
  });
});
