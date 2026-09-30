import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

import { PaymentFailPage } from './payment-fail-page';
import { PaymentCompleteView } from './payment-complete-view';
import { PaymentSuccessPage } from './payment-success-page';

describe('payment redirect pages', () => {
  it('승인 처리 중 상태를 먼저 표시한다', () => {
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: new QueryClient() },
        createElement(PaymentSuccessPage, {
          amount: '13000',
          orderId: 'ORDER_1',
          paymentKey: 'payment-key',
        }),
      ),
    );

    expect(markup).toContain('결제를 확인하고 있어요');
  });

  it('실제 결제 주문 스냅샷을 승인 완료 화면에 표시한다', () => {
    const markup = renderToStaticMarkup(
      createElement(PaymentCompleteView, {
        order: {
          selectedCartItemIds: [10, 12],
          deliveryAddress: {
            addressLine1: '서울시 강남구 테헤란로 1',
            addressLine2: '101호',
            phoneNumber: '01012345678',
            postalCode: '06123',
            recipientName: '김지웅',
          },
          deliveryRequest: { detail: '없음', location: '문 앞에 놓아주세요' },
          items: [
            {
              id: 'cart-item-1',
              imageUrl: 'https://cdn.example/onion.png',
              name: '국산 양파',
              price: 5900,
              quantity: 2,
            },
          ],
          orderNumber: 'ORDER_123',
          orderedAt: '2026-09-30T15:30:00Z',
          orderer: { name: '집밥사랑', phoneNumber: '01098765432' },
          paymentAmount: 14800,
        },
      }),
    );

    expect(markup).toContain('주문이 완료되었어요');
    expect(markup).toContain('주문번호');
    expect(markup).toContain('ORDER_123');
    expect(markup).toContain('2026.10.01');
    expect(markup).toContain('국산 양파');
    expect(markup).toContain('집밥사랑');
    expect(markup).toContain('010-9876-5432');
    expect(markup).toContain('서울시 강남구 테헤란로 1');
    expect(markup).toContain('문 앞에 놓아주세요');
    expect(markup).toContain('14,800원');
    expect(markup).not.toContain('하인즈 토마토 케찹');
    expect(markup).toContain('주문자 정보');
    expect(markup).toContain('결제 금액');
    expect(markup).toContain('/icons/payment/success-check.svg');
  });

  it('사용자가 결제를 취소하면 안전한 고정 안내를 표시한다', () => {
    const markup = renderToStaticMarkup(
      createElement(PaymentFailPage, {
        code: 'PAY_PROCESS_CANCELED',
        initialAttempt: { amount: 13000, name: '국산 양파', orderId: 'ORDER_1' },
      }),
    );

    expect(markup).toContain('결제가 취소됐어요');
    expect(markup).toContain('결제 다시 시도');
    expect(markup).not.toContain('href="/order"');
  });

  it('복원할 결제 정보가 없으면 장바구니 이동을 제공한다', () => {
    const markup = renderToStaticMarkup(
      createElement(PaymentFailPage, {
        code: 'PAY_PROCESS_CANCELED',
        initialAttempt: null,
      }),
    );

    expect(markup).toContain('href="/cart"');
    expect(markup).toContain('장바구니로 이동');
  });
});
