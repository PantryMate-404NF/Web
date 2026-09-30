import { describe, expect, it, vi } from 'vitest';

import {
  confirmAfterSessionRestore,
  confirmPaymentThenCleanupCart,
  getPaymentErrorMessage,
  parsePaymentSuccessParams,
  readPaymentAttempt,
} from './payment-redirect';

describe('confirmPaymentThenCleanupCart', () => {
  it('결제 확인이 성공한 뒤 장바구니 정리를 실행한다', async () => {
    const events: string[] = [];

    await expect(
      confirmPaymentThenCleanupCart(
        async () => {
          events.push('confirmed');
          return { status: 'DONE' };
        },
        (result) => result.status === 'DONE',
        async () => {
          events.push('cart-cleaned');
          return { completed: true, remainingCartItemIds: [] };
        },
      ),
    ).resolves.toEqual({
      confirmation: { status: 'DONE' },
      cleanupResult: { completed: true, remainingCartItemIds: [] },
    });

    expect(events).toEqual(['confirmed', 'cart-cleaned']);
  });

  it('결제 상태가 DONE이 아니면 장바구니를 정리하지 않는다', async () => {
    const cleanupCart = vi.fn();

    await expect(
      confirmPaymentThenCleanupCart(
        async () => ({ status: 'IN_PROGRESS' }),
        (result) => result.status === 'DONE',
        cleanupCart,
      ),
    ).resolves.toEqual({ confirmation: { status: 'IN_PROGRESS' }, cleanupResult: null });

    expect(cleanupCart).not.toHaveBeenCalled();
  });

  it('결제 확인이 실패하면 장바구니를 정리하지 않는다', async () => {
    const cleanupCart = vi.fn();

    await expect(
      confirmPaymentThenCleanupCart(
        async () => {
          throw new Error('payment was not confirmed');
        },
        () => true,
        cleanupCart,
      ),
    ).rejects.toThrow('payment was not confirmed');

    expect(cleanupCart).not.toHaveBeenCalled();
  });
});

describe('confirmAfterSessionRestore', () => {
  it('인증 복원이 끝난 뒤 결제 승인을 요청한다', async () => {
    const events: string[] = [];

    await confirmAfterSessionRestore(
      async () => {
        await Promise.resolve();
        events.push('session-restored');
        return 'complete';
      },
      async () => {
        events.push('payment-confirmed');
        return 'done';
      },
    );

    expect(events).toEqual(['session-restored', 'payment-confirmed']);
  });

  it('인증 복원에 실패하면 결제 승인을 요청하지 않는다', async () => {
    const confirm = async () => 'done';
    let confirmCalled = false;

    const result = await confirmAfterSessionRestore(
      async () => 'guest',
      async () => {
        confirmCalled = true;
        return confirm();
      },
    );

    expect(confirmCalled).toBe(false);
    expect(result).toEqual({ status: 'unauthenticated' });
  });
});

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
        { amount: 13000, name: '국산 양파', orderId: 'ORDER_1' },
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

describe('readPaymentAttempt', () => {
  it('저장된 주문 정보를 결제 재시도 상태로 복원한다', () => {
    const storage = {
      getItem: () =>
        JSON.stringify({ amount: 13000, name: '국산 양파 외 1건', orderId: 'ORDER_1' }),
    };

    expect(readPaymentAttempt(storage)).toEqual({
      amount: 13000,
      name: '국산 양파 외 1건',
      orderId: 'ORDER_1',
    });
  });

  it('저장된 결제 시점의 주문 스냅샷을 복원한다', () => {
    const completionSnapshot = {
      selectedCartItemIds: [10, 12],
      deliveryAddress: {
        addressLine1: '서울시 강남구 테헤란로 1',
        addressLine2: '101호',
        phoneNumber: '01012345678',
        postalCode: '06123',
        recipientName: '김지웅',
      },
      deliveryRequest: { detail: '없음', location: '문 앞에 놓아주세요' },
      items: [{ id: 'cart-item-1', name: '국산 양파', price: 5900, quantity: 2 }],
      orderNumber: 'ORDER_1',
      orderedAt: '2026-09-30T12:00:00',
      orderer: { name: '집밥사랑', phoneNumber: '01098765432' },
      paymentAmount: 14800,
    };

    expect(
      readPaymentAttempt({
        getItem: () =>
          JSON.stringify({
            amount: 14800,
            completionSnapshot,
            name: '국산 양파',
            orderId: 'ORDER_1',
          }),
      }),
    ).toEqual({ amount: 14800, completionSnapshot, name: '국산 양파', orderId: 'ORDER_1' });
  });

  it('주문명 또는 유효한 금액이 없는 저장 상태를 거부한다', () => {
    expect(
      readPaymentAttempt({
        getItem: () => JSON.stringify({ amount: 13000, orderId: 'ORDER_1' }),
      }),
    ).toBeNull();
    expect(
      readPaymentAttempt({
        getItem: () => JSON.stringify({ amount: 0, name: '국산 양파', orderId: 'ORDER_1' }),
      }),
    ).toBeNull();
  });
});
