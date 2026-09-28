import { beforeEach, describe, expect, it, vi } from 'vitest';

const { orderPaymentRequestMock } = vi.hoisted(() => ({
  orderPaymentRequestMock: vi.fn(),
}));

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

import { addCartItem } from './add-cart-item';

describe('addCartItem', () => {
  beforeEach(() => {
    orderPaymentRequestMock.mockReset();
  });

  it('상품 ID와 수량을 장바구니 추가 API에 전달한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ cartItemId: 7, productId: 101, quantity: 2 });

    await addCartItem({ productId: 101, quantity: 2 });

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/cart/items', {
      body: { productId: 101, quantity: 2 },
      method: 'POST',
    });
  });
});
