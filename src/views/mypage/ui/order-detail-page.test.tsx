import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { OrderDetailPage } from './order-detail-page';

describe('OrderDetailPage', () => {
  it('주문 상품·결제 정보와 취소 화면 링크를 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderDetailPage orderId="20260901" />);

    expect(markup).toContain('주문 상세내역');
    expect(markup).toContain('하인즈 토마토 케찹(342g)');
    expect(markup).toContain('주문 번호');
    expect(markup).toContain('href="/mypage/orders/20260901/cancel"');
    expect(markup).not.toContain('<header class="border-border');
    expect(markup).toContain('bg-border mt-4 h-px');
    expect(markup).toContain('px-4 pt-4 pb-0');
    expect(markup).toContain('border-b-8 px-4 py-4');
    expect(markup).toContain('mt-4 flex h-11');
    expect(markup).toContain('gap-[35px]');
    expect(markup).toContain('py-2.5');
    expect(markup).toContain('gap-[47px]');
    expect(markup).toContain('text-[var(--primitive-grey-600)]');
    expect(markup).toContain('text-[var(--primitive-black)]');
    expect(markup).toContain('text-[var(--primitive-grey-400)]');
    expect(markup).toContain('최종 결제금액');
    expect(markup).toContain('집밥사랑 / 010-1234-2222');
    expect(markup).toContain('whitespace-pre-line');
  });
});
