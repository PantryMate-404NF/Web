import { describe, expect, it } from 'vitest';

import { ORDER_HISTORY_MOCK, getOrderHistoryMock } from './mock';

describe('order history mock', () => {
  it('목록·상세·취소 화면이 사용할 주문과 상품·환불 정보를 제공한다', () => {
    const order = getOrderHistoryMock(ORDER_HISTORY_MOCK.id);

    expect(order?.items).toHaveLength(3);
    expect(order?.refund.estimatedAmount).toBe(11980);
    expect(order?.paymentMethod).toBe('토스페이');
  });

  it('알 수 없는 주문 ID는 undefined를 반환한다', () => {
    expect(getOrderHistoryMock('unknown')).toBeUndefined();
  });
});
