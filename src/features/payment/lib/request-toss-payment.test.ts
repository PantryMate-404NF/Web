import { describe, expect, it, vi } from 'vitest';

import { requestTossPayment } from './request-toss-payment';

describe('requestTossPayment', () => {
  it('서버 주문 정보와 절대 리다이렉트 URL로 카드 결제를 요청한다', async () => {
    const requestPayment = vi.fn().mockResolvedValue(undefined);
    const payment = vi.fn(() => ({ requestPayment }));
    const loadSdk = vi.fn().mockResolvedValue({ payment });
    const storage = { setItem: vi.fn() };

    await requestTossPayment(
      { name: '국산 양파 외 1건', orderId: 'ORDER_1', totalAmount: 42500 },
      { clientKey: 'test-client-key', loadSdk, origin: 'http://localhost:3000', storage },
    );

    expect(payment).toHaveBeenCalledWith({ customerKey: '@@ANONYMOUS' });
    expect(requestPayment).toHaveBeenCalledWith({
      amount: { currency: 'KRW', value: 42500 },
      failUrl: 'http://localhost:3000/payment/fail',
      method: 'CARD',
      orderId: 'ORDER_1',
      orderName: '국산 양파 외 1건',
      successUrl: 'http://localhost:3000/payment/success',
      windowTarget: 'self',
    });
    expect(storage.setItem).toHaveBeenCalledWith(
      'order-payment-attempt',
      JSON.stringify({ amount: 42500, orderId: 'ORDER_1' }),
    );
  });

  it('클라이언트 키가 없으면 설정 오류를 반환한다', async () => {
    await expect(
      requestTossPayment(
        { name: '국산 양파', orderId: 'ORDER_1', totalAmount: 13000 },
        { clientKey: '', loadSdk: vi.fn(), origin: 'http://localhost:3000' },
      ),
    ).rejects.toThrow('NEXT_PUBLIC_TOSS_CLIENT_KEY');
  });
});
