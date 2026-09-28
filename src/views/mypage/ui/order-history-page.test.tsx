import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { OrderHistoryPage } from './order-history-page';

describe('OrderHistoryPage', () => {
  it('Figma 상세현황과 결제 완료 주문 상품 목록을 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 / 배송 목록');
    expect(markup).toContain('상세현황');
    expect(markup).toContain('주문취소/환불');
    const orderStatusMarkup = markup.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1];
    expect(orderStatusMarkup?.replaceAll(/<[^>]+>/g, '')).toBe(
      '0결제완료1배송준비0배송 중3배송완료',
    );
    expect(markup).toContain('1547521567248');
    expect(markup).toContain('/images/order/copy-icon.svg');
    expect(markup).toContain('width="30"');
    expect(markup).toContain('height="28"');
    expect(markup).toContain('-ml-1');
    expect(markup.match(/2026\.09\.01/g)).toHaveLength(4);
    expect(markup).toContain('class="mt-4 space-y-4"');
    expect(markup).toContain('class="flex items-start gap-2"');
    expect(markup).toContain('class="size-[76px] shrink-0 rounded-xl object-cover"');
    expect(markup).toContain('하인즈 토마토 케찹(342g)');
    expect(markup).toContain('href="/mypage/orders/20260901"');
    expect(markup).toContain('배송조회');
    expect(markup).toContain('href="/mypage/delivery"');
    expect(markup).not.toContain('장바구니 담기');
    expect(markup).toContain('mt-6');
    expect(markup).toContain('w-10');
    expect(markup).toContain('size-8');
    expect(markup).toContain('pt-1');
    expect(markup).toContain('leading-9');
    expect(markup).toContain('bg-muted');
    expect(markup).toContain('whitespace-nowrap');
    expect(markup).not.toContain('border-y-8');
    expect(markup.match(/h-2 w-full bg-\[var\(--primitive-grey-100\)\]/g)).toHaveLength(2);
  });
});
