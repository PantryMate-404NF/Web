import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderPaymentRequestMock = vi.hoisted(() => vi.fn());

vi.mock('@/shared/api/order-payment-client', () => ({
  orderPaymentRequest: orderPaymentRequestMock,
}));

describe('order history API', () => {
  beforeEach(() => orderPaymentRequestMock.mockReset());

  it('기본 페이지의 주문 목록을 조회한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 });
    const { getOrders } = await import('./get-orders');

    await getOrders();

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/orders?page=0&size=20');
  });

  it('상태와 페이지 조건을 주문 목록 요청에 전달한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 });
    const { getOrders } = await import('./get-orders');

    await getOrders({ status: 'CONFIRMED', page: 2, size: 10 });

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/orders?status=CONFIRMED&page=2&size=10');
  });

  it('주문 식별자로 상세 정보를 조회한다', async () => {
    orderPaymentRequestMock.mockResolvedValue({ orderId: 'ORDER_1' });
    const { getOrderDetail } = await import('./get-order-detail');

    await getOrderDetail('ORDER_1');

    expect(orderPaymentRequestMock).toHaveBeenCalledWith('/orders/ORDER_1');
  });
});
