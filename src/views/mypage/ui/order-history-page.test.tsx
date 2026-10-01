import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useOrderHistoryQueryMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/order/api/use-order-history-query', () => ({
  useOrderHistoryQuery: useOrderHistoryQueryMock,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { OrderHistoryPage } from './order-history-page';

const order = {
  id: 'ORDER_1',
  orderedAt: '2026.09.30',
  orderNumber: 'ORDER_1',
  paymentAmount: 15000,
  status: 'CONFIRMED',
  statusLabel: '결제 완료',
  items: [
    {
      id: 'ORDER_1-0',
      name: '국내산 대파 1단',
      price: 3000,
      quantity: 2,
      thumbnailUrl: 'https://cdn.example.com/scallion.jpg',
    },
  ],
};

describe('OrderHistoryPage', () => {
  beforeEach(() => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: [order],
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
  });

  it('실제 주문 목록의 주문과 상품 정보를 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 / 배송 목록');
    expect(markup).toContain('ORDER_1');
    expect(markup).toContain('국내산 대파 1단');
    expect(markup).toContain('3,000원');
    expect(markup).toContain('/ 2개');
    expect(markup).toContain('href="/mypage/orders/ORDER_1"');
    expect(markup).not.toContain('하인즈 토마토 케찹');
    expect(markup).toContain('https://cdn.example.com/scallion.jpg');
    expect(markup).not.toContain('ingredient-image-placeholder.png');
  });

  it('thumbnailUrl이 없는 상품에는 placeholder를 사용한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: [{ ...order, items: [{ ...order.items[0], thumbnailUrl: null }] }],
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('ingredient-image-placeholder.png');
  });

  it('기존 상태현황과 배송준비 화면 링크를 유지한다', () => {
    const markup = renderToStaticMarkup(<OrderHistoryPage />);
    const orderStatusMarkup = markup.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1];

    expect(markup).toContain('상세현황');
    expect(markup).toContain('주문취소/환불');
    expect(orderStatusMarkup?.replaceAll(/<[^>]+>/g, '')).toBe(
      '1결제완료0배송준비0배송 중3배송완료',
    );
    expect(markup).toMatch(/<a[^>]*href="\/mypage\/orders\/preparing"[^>]*>배송준비<\/a>/);
  });

  it('주문 조회 중에는 목업 주문 대신 로딩 상태를 표시한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 내역을 불러오는 중');
    expect(markup).not.toContain('하인즈 토마토 케찹');
  });

  it('주문 내역이 비어 있으면 빈 상태를 표시한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: [],
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 내역이 없어요');
    expect(markup).not.toContain('1547521567248');
  });

  it('조회 오류를 목업 대신 안내하고 재시도 동작을 제공한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('network error'),
      isError: true,
      isPending: false,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 내역을 불러오지 못했어요');
    expect(markup).toContain('다시 시도');
  });

  it('요청이 실패하면 데이터가 비어 있어도 로딩보다 오류 상태를 우선 표시한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('404 Not Found'),
      isError: true,
      isPending: true,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 내역을 불러오지 못했어요');
    expect(markup).not.toContain('주문 내역을 불러오는 중이에요');
  });

  it('배송준비 페이지의 라벨과 링크를 유지한다', () => {
    const markup = renderToStaticMarkup(<OrderHistoryPage status="preparing" />);

    expect(markup).toContain('배송 준비');
    expect(markup).toContain('href="/mypage/orders"');
    expect(markup).toContain('href="/mypage/delivery"');
    expect(markup).toContain('배송조회');
  });
});
