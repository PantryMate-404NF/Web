import { describe, expect, it } from 'vitest';

import { formatOrderDate, toOrderHistoryRecord } from './order-history';

describe('order history mapping', () => {
  it('주문 요약과 상세 응답을 실제 목록 화면 데이터로 결합한다', () => {
    expect(
      toOrderHistoryRecord(
        {
          orderId: 'ORDER_1',
          createdAt: '2026-09-30T17:00:00Z',
          totalAmount: 15000,
          status: 'CONFIRMED',
          representativeProductName: '국내산 대파 1단 외 1건',
        },
        {
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
            { productName: '햇양파 1kg', price: 9000, quantity: 1, subtotal: 9000 },
          ],
          payment: { method: '카드', status: 'DONE', approvedAt: '2026-09-30T17:00:03Z' },
          availableActions: [],
        },
      ),
    ).toEqual({
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
        { id: 'ORDER_1-1', name: '햇양파 1kg', price: 9000, quantity: 1 },
      ],
    });
  });

  it('시간대와 무관하게 API 날짜의 calendar 부분을 표시한다', () => {
    expect(formatOrderDate('2026-01-02T00:10:00Z')).toBe('2026.01.02');
  });
});
