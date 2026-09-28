import { describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.fn();

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('getCart', () => {
  it('최신 연동 문서의 장바구니 경로로 조회한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ cartId: 1, items: [] });
    const { getCart } = await import('./get-cart');

    await getCart();

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/cart');
  });
});
