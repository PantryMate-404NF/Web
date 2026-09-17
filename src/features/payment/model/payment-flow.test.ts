import { describe, expect, it, vi } from 'vitest';

import { createPaymentExecutor } from './payment-flow';

const orderResponse = {
  createdAt: '2026-09-17T00:00:00',
  name: '국산 양파 외 1건',
  orderId: 'ORDER_1',
  status: 'PENDING' as const,
  totalAmount: 42500,
};

describe('createPaymentExecutor', () => {
  it('주문 생성, 결제 준비, 토스 결제 요청을 순서대로 실행한다', async () => {
    const calls: string[] = [];
    const createOrder = vi.fn(async () => {
      calls.push('order');
      return orderResponse;
    });
    const preparePayment = vi.fn(async () => {
      calls.push('prepare');
      return { paymentId: 1, orderId: 'ORDER_1', status: 'READY' as const, totalAmount: 42500 };
    });
    const requestPayment = vi.fn(async () => {
      calls.push('toss');
    });
    const execute = createPaymentExecutor({ createOrder, preparePayment, requestPayment });

    await execute({ cartId: 3, idempotencyKey: 'uuid', selectedCartItemIds: [10, 12] });

    expect(calls).toEqual(['order', 'prepare', 'toss']);
    expect(requestPayment).toHaveBeenCalledWith({
      name: '국산 양파 외 1건',
      orderId: 'ORDER_1',
      totalAmount: 42500,
    });
  });

  it('실행 중 다시 호출해도 결제 흐름은 한 번만 실행한다', async () => {
    let resolveOrder: ((value: typeof orderResponse) => void) | undefined;
    const createOrder = vi.fn(
      () =>
        new Promise<typeof orderResponse>((resolve) => {
          resolveOrder = resolve;
        }),
    );
    const preparePayment = vi.fn().mockResolvedValue({});
    const requestPayment = vi.fn().mockResolvedValue(undefined);
    const execute = createPaymentExecutor({ createOrder, preparePayment, requestPayment });
    const input = { cartId: 3, idempotencyKey: 'uuid', selectedCartItemIds: [10] };

    const first = execute(input);
    const second = execute(input);

    resolveOrder?.(orderResponse);
    await Promise.all([first, second]);

    expect(createOrder).toHaveBeenCalledTimes(1);
    expect(preparePayment).toHaveBeenCalledTimes(1);
    expect(requestPayment).toHaveBeenCalledTimes(1);
  });
});
