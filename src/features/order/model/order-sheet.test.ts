import { describe, expect, it } from 'vitest';

import type { CartItem } from '@/entities/cart/model/cart-store';

import {
  areAllRequiredAgreementsSelected,
  buildPaymentExecutionInput,
  buildOrderHref,
  calculateOrderAmounts,
  ORDER_AGREEMENT_IDS,
  selectOrderItems,
  toggleOrderAgreement,
} from './order-sheet';

const items: CartItem[] = [
  { id: 'onion', ingredient: '양파', name: '국산 양파', price: 5900, quantity: 1 },
  { id: 'potato', ingredient: '감자', name: '무농약 감자', price: 6600, quantity: 2 },
];

describe('order sheet model', () => {
  it('장바구니에서 선택한 상품 ID를 주문 경로에 전달한다', () => {
    expect(buildOrderHref(3, ['10', '12'])).toBe('/order?cartId=3&items=10%2C12');
  });

  it('선택 ID에 해당하는 장바구니 상품만 주문 대상으로 사용한다', () => {
    expect(selectOrderItems(items, ['potato'])).toEqual([items[1]]);
    expect(selectOrderItems(items, [])).toEqual(items);
  });

  it('주문 금액과 배송비를 합산한다', () => {
    expect(calculateOrderAmounts(items)).toEqual({
      finalAmount: 22100,
      orderAmount: 19100,
      shippingFee: 3000,
    });
    expect(calculateOrderAmounts([])).toEqual({
      finalAmount: 0,
      orderAmount: 0,
      shippingFee: 0,
    });
  });

  it('약관을 개별 선택하고 필수 약관 완료 여부를 판단한다', () => {
    const selected = ORDER_AGREEMENT_IDS.reduce<string[]>(
      (current, agreementId) => toggleOrderAgreement(current, agreementId),
      [],
    );

    expect(areAllRequiredAgreementsSelected(selected)).toBe(true);
    expect(toggleOrderAgreement(selected, ORDER_AGREEMENT_IDS[0])).not.toContain(
      ORDER_AGREEMENT_IDS[0],
    );
  });

  it('서버 장바구니 식별자로 결제 실행 입력을 만든다', () => {
    expect(buildPaymentExecutionInput(3, [10, 12], 'uuid')).toEqual({
      cartId: 3,
      idempotencyKey: 'uuid',
      selectedCartItemIds: [10, 12],
    });
    expect(() => buildPaymentExecutionInput(undefined, [10], 'uuid')).toThrow(
      '장바구니 API 정보가 필요합니다.',
    );
    expect(() => buildPaymentExecutionInput(3, [], 'uuid')).toThrow(
      '주문할 장바구니 상품이 필요합니다.',
    );
  });
});
