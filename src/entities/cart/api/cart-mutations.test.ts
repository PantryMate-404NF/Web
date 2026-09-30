import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAccessToken, setAuthenticatedUserId } from '@/shared/model/access-token-store';

const orderPaymentRequestMock = vi.fn();

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('cart mutations', () => {
  beforeEach(() => {
    orderPaymentRequestMock.mockReset();
    clearAccessToken();
    setAuthenticatedUserId('user-42');
  });

  it('장바구니 항목 수량을 변경한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ cartItemId: 10, productId: 101, quantity: 3 });
    const { updateCartItem } = await import('./update-cart-item');

    await updateCartItem(10, 3);

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/carts/items/10', {
      body: { quantity: 3 },
      headers: { 'X-User-Id': 'user-42' },
      method: 'PATCH',
    });
  });

  it('장바구니 항목을 삭제한다', async () => {
    orderPaymentRequestMock.mockResolvedValue(undefined);
    const { deleteCartItem } = await import('./delete-cart-item');

    await deleteCartItem(10);

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/carts/items/10', {
      headers: { 'X-User-Id': 'user-42' },
      method: 'DELETE',
      responseType: 'none',
    });
  });
});
