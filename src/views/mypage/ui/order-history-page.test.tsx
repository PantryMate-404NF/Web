import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { OrderHistoryPage } from './order-history-page';

describe('OrderHistoryPage', () => {
  it('기본 화면은 결제 완료 주문 목록을 표시하고 배송준비 화면으로 연결한다', () => {
    const markup = renderToStaticMarkup(<OrderHistoryPage />);

    expect(markup).toContain('주문 / 배송 목록');
    expect(markup).toContain('상세현황');
    expect(markup).toContain('주문취소/환불');
    const orderStatusMarkup = markup.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1];
    expect(orderStatusMarkup?.replaceAll(/<[^>]+>/g, '')).toBe(
      '1결제완료0배송준비0배송 중3배송완료',
    );
    expect(markup).toMatch(/<a[^>]*href="\/mypage\/orders\/preparing"[^>]*>배송준비<\/a>/);
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
    expect(markup).not.toContain('배송조회');
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

  it('배송준비 화면은 준비 중 주문 목록과 배송조회 진입 버튼을 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderHistoryPage status="preparing" />);

    const orderStatusMarkup = markup.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1];
    expect(orderStatusMarkup?.replaceAll(/<[^>]+>/g, '')).toBe(
      '0결제완료1배송준비0배송 중3배송완료',
    );
    expect(markup).toContain('배송 준비');
    expect(markup).toContain('href="/mypage/orders"');
    expect(markup).toContain('href="/mypage/delivery"');
    expect(markup).toContain('배송조회');
  });
});
