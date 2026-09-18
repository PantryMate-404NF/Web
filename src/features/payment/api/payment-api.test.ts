import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.fn();

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('payment API', () => {
  beforeEach(() => {
    orderPaymentRequestMock.mockReset();
  });

  it('주문 ID로 결제를 준비한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ orderId: 'ORDER_1', status: 'READY' });
    const { preparePayment } = await import('./prepare-payment');

    await preparePayment('ORDER_1');

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/payments/ORDER_1/prepare', {
      method: 'POST',
    });
  });

  it('리다이렉트 결제 정보로 승인을 요청한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ paymentKey: 'payment-key', status: 'DONE' });
    const { confirmPayment } = await import('./confirm-payment');
    const input = { amount: 13000, orderId: 'ORDER_1', paymentKey: 'payment-key' };

    await confirmPayment(input);

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/payments/confirm', {
      body: input,
      method: 'POST',
    });
  });
});
