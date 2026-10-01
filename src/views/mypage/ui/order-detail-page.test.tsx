import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useOrderDetailQueryMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/order/api/use-order-detail-query', () => ({
  useOrderDetailQuery: useOrderDetailQueryMock,
}));

import { OrderDetailPage } from './order-detail-page';

const orderDetail = {
  orderId: 'ORDER_1',
  status: 'CONFIRMED',
  totalAmount: 15000,
  createdAt: '2026-09-30T17:00:00Z',
  items: [
    {
      productName: '국내산 대파 1단',
      price: 3000,
      quantity: 2,
      subtotal: 6000,
      thumbnailUrl: 'https://cdn.example.com/scallion.jpg',
    },
  ],
  payment: {
    method: '카드',
    status: 'DONE',
    approvedAt: '2026-09-30T17:00:03Z',
  },
  availableActions: [],
};

describe('OrderDetailPage', () => {
  beforeEach(() => {
    useOrderDetailQueryMock.mockReturnValue({
      data: orderDetail,
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
  });

  it('상세 API의 실제 상품·결제 정보를 표시하고 목업 배송정보를 노출하지 않는다', () => {
    const markup = renderToStaticMarkup(<OrderDetailPage orderId="ORDER_1" />);

    expect(markup).toContain('주문 상세내역');
    expect(markup).toContain('국내산 대파 1단');
    expect(markup).toContain('3,000원');
    expect(markup).toContain('2개');
    expect(markup).toContain('https://cdn.example.com/scallion.jpg');
    expect(markup).toContain('ORDER_1');
    expect(markup).toContain('15,000원');
    expect(markup).toContain('카드');
    expect(markup).not.toContain('하인즈 토마토 케찹');
    expect(markup).not.toContain('집밥사랑');
    expect(markup).not.toContain('19,100원');
    expect(markup).not.toContain('배송지');
    expect(markup).toContain('href="/mypage/orders/ORDER_1/cancel"');
  });

  it('상세 조회 중에는 주문정보 대신 로딩 상태를 표시한다', () => {
    useOrderDetailQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<OrderDetailPage orderId="ORDER_1" />);

    expect(markup).toContain('주문 상세를 불러오는 중');
    expect(markup).not.toContain('국내산 대파 1단');
  });

  it('주문 상세 조회 실패를 안내하고 재시도할 수 있다', () => {
    useOrderDetailQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('network error'),
      isError: true,
      isPending: false,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<OrderDetailPage orderId="ORDER_1" />);

    expect(markup).toContain('주문 상세를 불러오지 못했어요');
    expect(markup).toContain('다시 시도');
  });

  it('결제 완료 상태가 아니면 주문 취소 진입 링크를 표시하지 않는다', () => {
    useOrderDetailQueryMock.mockReturnValue({
      data: { ...orderDetail, status: 'PENDING' },
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<OrderDetailPage orderId="ORDER_1" />);

    expect(markup).not.toContain('href="/mypage/orders/ORDER_1/cancel"');
  });

  it('주문 취소 버튼을 구매 상품 목록 바로 아래에 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderDetailPage orderId="ORDER_1" />);

    expect(markup.indexOf('국내산 대파 1단')).toBeLessThan(markup.indexOf('주문 취소'));
    expect(markup.indexOf('주문 취소')).toBeLessThan(markup.indexOf('주문 정보'));
  });
});
