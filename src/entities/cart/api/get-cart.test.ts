import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.fn();

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('getCart', () => {
  beforeEach(async () => {
    orderPaymentRequestMock.mockReset();
    const { clearAccessToken } = await import('@/shared/model/access-token-store');

    clearAccessToken();
  });

  afterEach(async () => {
    const { clearAccessToken } = await import('@/shared/model/access-token-store');

    clearAccessToken();
  });

  it('현재 로그인 사용자 ID를 포함해 복수형 장바구니 API에서 조회한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ cartId: 1, items: [] });
    const { setAuthenticatedUserId } = await import('@/shared/model/access-token-store');
    const { getCart } = await import('./get-cart');
    setAuthenticatedUserId('user-42');

    await getCart();

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/carts', {
      headers: { 'X-User-Id': 'user-42' },
    });
  });

  it('사용자 ID가 없으면 사용자 범위가 없는 장바구니 조회를 보내지 않는다', async () => {
    const { clearAccessToken } = await import('@/shared/model/access-token-store');
    const { getCart } = await import('./get-cart');
    clearAccessToken();

    expect(() => getCart()).toThrow('로그인 사용자 정보를 확인할 수 없습니다.');
    expect(orderPaymentRequestMock).not.toHaveBeenCalled();
  });
});
