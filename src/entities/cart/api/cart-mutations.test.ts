import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.fn();

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('cart mutations', () => {
  beforeEach(() => {
    orderPaymentRequestMock.mockReset();
  });

  it('장바구니 항목 수량을 변경한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ cartItemId: 10, productId: 101, quantity: 3 });
    const { updateCartItem } = await import('./update-cart-item');

    await updateCartItem(10, 3);

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/carts/items/10', {
      body: { quantity: 3 },
      method: 'PATCH',
    });
  });

  it('장바구니 항목을 삭제한다', async () => {
    orderPaymentRequestMock.mockResolvedValue(undefined);
    const { deleteCartItem } = await import('./delete-cart-item');

    await deleteCartItem(10);

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/carts/items/10', {
      method: 'DELETE',
      responseType: 'none',
    });
  });
});
