import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('./http-client', () => ({ request: requestMock }));

describe('orderPaymentRequest', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('Gateway API 경로를 공통 Bearer 인증 클라이언트로 요청한다', async () => {
    requestMock.mockResolvedValue({ cartId: 1, items: [] });
    const { orderPaymentRequest } = await import('./order-payment-client');

    await expect(orderPaymentRequest<{ cartId: number }>('/carts')).resolves.toEqual({
      cartId: 1,
      items: [],
    });

    expect(requestMock).toHaveBeenCalledWith('/api/carts', {});
  });

  it('요청 옵션을 Gateway 클라이언트에 그대로 전달한다', async () => {
    requestMock.mockResolvedValue({ orderId: 'ORDER_1' });
    const { orderPaymentRequest } = await import('./order-payment-client');
    const options = {
      body: { cartId: 3, selectedCartItemIds: [10] },
      headers: { 'Idempotency-Key': 'uuid' },
      method: 'POST',
    };

    await orderPaymentRequest('/orders', options);

    expect(requestMock).toHaveBeenCalledWith('/api/orders', options);
  });

  it('무응답 계약을 Gateway 클라이언트에 전달한다', async () => {
    requestMock.mockResolvedValue(undefined);
    const { orderPaymentRequest } = await import('./order-payment-client');

    await expect(
      orderPaymentRequest('/carts/items/10', {
        method: 'DELETE',
        responseType: 'none',
      }),
    ).resolves.toBeUndefined();

    expect(requestMock).toHaveBeenCalledWith('/api/carts/items/10', {
      method: 'DELETE',
      responseType: 'none',
    });
  });
});
