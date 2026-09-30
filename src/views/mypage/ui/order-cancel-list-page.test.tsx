import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useOrderHistoryQueryMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/order/api/use-order-history-query', () => ({
  useOrderHistoryQuery: useOrderHistoryQueryMock,
}));

import { OrderCancelListPage } from './order-cancel-list-page';

const cancelledOrder = {
  id: 'ORDER_1',
  orderedAt: '2026.09.01',
  orderNumber: 'ORDER_1',
  paymentAmount: 19100,
  status: 'CANCELLED',
  statusLabel: '취소 완료',
  items: [
    {
      id: 'ORDER_1-0',
      name: '하인즈 토마토 케찹(342g)',
      price: 6300,
      quantity: 1,
      thumbnailUrl: 'https://cdn.example.com/ketchup.jpg',
    },
  ],
};

describe('OrderCancelListPage', () => {
  beforeEach(() => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: [cancelledOrder],
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
  });

  it('취소된 주문 API의 실제 상품과 주문 정보를 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderCancelListPage />);

    expect(useOrderHistoryQueryMock).toHaveBeenCalledWith('CANCELLED');
    expect(markup).toContain('주문 취소/환불');
    expect(markup).toContain('2026.09.01');
    expect(markup).toContain('취소 완료');
    expect(markup).toContain('1개');
    expect(markup).toContain('하인즈 토마토 케찹(342g)');
    expect(markup).toContain('6,300원');
    expect(markup).toContain('https://cdn.example.com/ketchup.jpg');
    expect(markup).toContain('href="/mypage/orders/ORDER_1"');
    expect(markup).not.toContain('20260901');
  });

  it('취소 내역을 불러오는 동안 목업 대신 로딩 상태를 표시한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<OrderCancelListPage />);

    expect(markup).toContain('취소 내역을 불러오는 중이에요.');
    expect(markup).not.toContain('하인즈 토마토 케찹');
  });

  it('취소 내역이 비어 있으면 빈 상태를 표시한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: [],
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<OrderCancelListPage />);

    expect(markup).toContain('취소/환불 내역이 없어요.');
    expect(markup).not.toContain('하인즈 토마토 케찹');
  });

  it('취소 내역 조회 실패를 안내하고 재시도할 수 있다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('network error'),
      isError: true,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<OrderCancelListPage />);

    expect(markup).toContain('취소 내역을 불러오지 못했어요.');
    expect(markup).toContain('다시 시도');
  });
});
