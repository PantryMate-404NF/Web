import { describe, expect, it } from 'vitest';

import { getPaymentErrorMessage, parsePaymentSuccessParams } from './payment-redirect';

describe('parsePaymentSuccessParams', () => {
  it('유효한 결제 성공 파라미터를 승인 요청으로 변환한다', () => {
    expect(
      parsePaymentSuccessParams({ amount: '13000', orderId: 'ORDER_1', paymentKey: 'payment-key' }),
    ).toEqual({ amount: 13000, orderId: 'ORDER_1', paymentKey: 'payment-key' });
  });

  it.each(['', '0', '-1', '1.5', 'not-a-number'])('유효하지 않은 금액 %s을 거부한다', (amount) => {
    expect(
      parsePaymentSuccessParams({ amount, orderId: 'ORDER_1', paymentKey: 'payment-key' }),
    ).toBeNull();
  });

  it('저장된 주문 ID와 금액이 다르면 거부한다', () => {
    expect(
      parsePaymentSuccessParams(
        { amount: '13000', orderId: 'ORDER_2', paymentKey: 'payment-key' },
        { amount: 13000, orderId: 'ORDER_1' },
      ),
    ).toBeNull();
  });
});

describe('getPaymentErrorMessage', () => {
  it.each([
    ['AMOUNT_MISMATCH', '주문 금액이 변경되어 결제를 완료하지 못했어요.'],
    ['PAYMENT_FAILED', '결제 승인이 실패했어요. 다른 결제수단을 이용해 주세요.'],
    ['INSUFFICIENT_STOCK', '재고가 부족해 결제가 자동으로 취소됐어요.'],
    ['PAYMENT_IN_PROGRESS', '결제를 처리하고 있어요. 잠시 후 다시 확인해 주세요.'],
  ])('%s 오류를 사용자 안내로 변환한다', (code, message) => {
    expect(getPaymentErrorMessage({ code })).toBe(message);
  });
});
