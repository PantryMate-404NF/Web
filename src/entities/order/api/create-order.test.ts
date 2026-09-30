import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.fn();

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('createOrder', () => {
  beforeEach(() => {
    orderPaymentRequestMock.mockReset();
  });

  it('선택한 장바구니 항목과 멱등 키로 주문을 생성한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ orderId: 'ORDER_1' });
    const { createOrder } = await import('./create-order');

    await createOrder(
      {
        cartId: 3,
        selectedCartItemIds: [10, 12],
        deliveryAddress: {
          recipientName: '김지웅',
          recipientPhone: '01012345678',
          zipCode: '13485',
          address: '경기도 성남시 분당구 불정로 90',
          addressDetail: '101동 1001호',
        },
      },
      'request-uuid',
    );

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/orders', {
      body: {
        cartId: 3,
        selectedCartItemIds: [10, 12],
        deliveryAddress: {
          recipientName: '김지웅',
          recipientPhone: '01012345678',
          zipCode: '13485',
          address: '경기도 성남시 분당구 불정로 90',
          addressDetail: '101동 1001호',
        },
      },
      headers: { 'Idempotency-Key': 'request-uuid' },
      method: 'POST',
    });
  });
});
