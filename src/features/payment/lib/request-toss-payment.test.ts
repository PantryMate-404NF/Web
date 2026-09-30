import { describe, expect, it, vi } from 'vitest';

import { requestTossPayment } from './request-toss-payment';

describe('requestTossPayment', () => {
  it('결제창형 위젯으로 주문 금액을 설정하고 인증 리다이렉트 결제를 요청한다', async () => {
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
    const requestPayment = vi.fn().mockResolvedValue(undefined);
    const setAmount = vi.fn().mockResolvedValue(undefined);
    const on = vi.fn((eventName, callback) => {
      if (eventName === 'paymentRequest') {
        void callback({ paymentMethod: { code: 'CARD' } });
      }
    });
    const renderPaymentWindow = vi.fn().mockResolvedValue({ on });
    const widgets = { requestPayment, renderPaymentWindow, setAmount };
    const initializeWidgets = vi.fn(() => widgets);
    const loadSdk = vi.fn().mockResolvedValue({ widgets: initializeWidgets });
    const storage = { setItem: vi.fn() };

    await requestTossPayment(
      {
        completionSnapshot,
        name: '국산 양파 외 1건',
        orderId: 'ORDER_1',
        totalAmount: 42500,
      },
      { clientKey: 'test-client-key', loadSdk, origin: 'http://localhost:3000', storage },
    );

    expect(initializeWidgets).toHaveBeenCalledWith({ customerKey: '@@ANONYMOUS' });
    expect(widgets.setAmount).toHaveBeenCalledWith({ currency: 'KRW', value: 42500 });
    expect(widgets.renderPaymentWindow).toHaveBeenCalledWith();
    expect(requestPayment).toHaveBeenCalledWith({
      failUrl: 'http://localhost:3000/payment/fail',
      orderId: 'ORDER_1',
      orderName: '국산 양파 외 1건',
      successUrl: 'http://localhost:3000/payment/success',
      windowTarget: 'self',
    });
    expect(on).toHaveBeenCalledWith('paymentRequest', expect.any(Function));
    expect(storage.setItem).toHaveBeenCalledWith(
      'order-payment-attempt',
      JSON.stringify({
        amount: 42500,
        completionSnapshot,
        name: '국산 양파 외 1건',
        orderId: 'ORDER_1',
      }),
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

  it('결제창에서 취소하면 결제 요청 없이 실행을 종료한다', async () => {
    const requestPayment = vi.fn().mockResolvedValue(undefined);
    const setAmount = vi.fn().mockResolvedValue(undefined);
    const on = vi.fn((eventName: 'paymentRequest' | 'cancel', callback: () => Promise<void>) => {
      if (eventName === 'cancel') void callback();
    });
    const renderPaymentWindow = vi.fn().mockResolvedValue({ on });
    const loadSdk = vi.fn().mockResolvedValue({
      widgets: vi.fn(() => ({ requestPayment, renderPaymentWindow, setAmount })),
    });

    await requestTossPayment(
      { name: '국산 양파', orderId: 'ORDER_1', totalAmount: 13000 },
      {
        clientKey: 'test-client-key',
        loadSdk,
        origin: 'http://localhost:3000',
        storage: { setItem: vi.fn() },
      },
    );

    expect(on).toHaveBeenCalledWith('cancel', expect.any(Function));
    expect(requestPayment).not.toHaveBeenCalled();
  });
});
