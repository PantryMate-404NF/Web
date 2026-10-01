import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.hoisted(() => vi.fn());

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

import { cancelOrder } from './cancel-order';

describe('cancelOrder', () => {
  beforeEach(() => orderPaymentRequestMock.mockReset());

  it('주문 ID와 선택한 취소 사유만 담아 취소 POST를 전송한다', async () => {
    orderPaymentRequestMock.mockResolvedValue(undefined);

    await cancelOrder('ORDER_1', '단순 변심');

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/payments/ORDER_1/cancel', {
      method: 'POST',
      body: { cancelReason: '단순 변심' },
      responseType: 'none',
    });
  });

  it('주문 ID를 URL 경로에 맞게 인코딩한다', async () => {
    orderPaymentRequestMock.mockResolvedValue(undefined);

    await cancelOrder('ORDER / 1', '기타');

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/payments/ORDER%20%2F%201/cancel', {
      method: 'POST',
      body: { cancelReason: '기타' },
      responseType: 'none',
    });
  });
});
