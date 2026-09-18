import { describe, expect, it } from 'vitest';

import { isOrderCancellationSubmittable } from './order-cancel';

describe('isOrderCancellationSubmittable', () => {
  it('취소 사유와 동의가 모두 선택될 때만 주문 취소를 활성화한다', () => {
    expect(isOrderCancellationSubmittable(undefined, false)).toBe(false);
    expect(isOrderCancellationSubmittable('단순 변심', false)).toBe(false);
    expect(isOrderCancellationSubmittable(undefined, true)).toBe(false);
    expect(isOrderCancellationSubmittable('단순 변심', true)).toBe(true);
  });
});
