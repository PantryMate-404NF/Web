import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

import { PaymentFailPage } from './payment-fail-page';
import { PaymentSuccessPage } from './payment-success-page';

describe('payment redirect pages', () => {
  it('승인 처리 중 상태를 먼저 표시한다', () => {
    const markup = renderToStaticMarkup(
      createElement(PaymentSuccessPage, {
        amount: '13000',
        orderId: 'ORDER_1',
        paymentKey: 'payment-key',
      }),
    );

    expect(markup).toContain('결제를 확인하고 있어요');
  });

  it('승인 완료 후 주문 정보와 주문 내역 이동을 표시한다', () => {
    const markup = renderToStaticMarkup(
      createElement(PaymentSuccessPage, {
        initialStatus: 'done',
      }),
    );

    expect(markup).toContain('주문이 완료되었어요');
    expect(markup).toContain('주문번호');
    expect(markup).toContain('1547521567248');
    expect(markup).toContain('하인즈 토마토 케찹(342g)');
    expect(markup).toContain('주문자 정보');
    expect(markup).toContain('배송 요청사항');
    expect(markup).toContain('결제 금액');
    expect(markup).toContain('href="/mypage/orders/20260901"');
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
