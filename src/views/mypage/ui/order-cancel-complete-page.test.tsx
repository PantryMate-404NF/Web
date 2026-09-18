import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { OrderCancelCompletePage } from './order-cancel-complete-page';

describe('OrderCancelCompletePage', () => {
  it('취소 요청 완료 문구와 신청내역 보기 링크를 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderCancelCompletePage orderId="20260901" />);

    expect(markup).toContain('주문이 취소되었어요');
    expect(markup).toContain('환불은 이용하신 결제 방법에 따라');
    expect(markup).toContain('1~2일 이상 소요될 수 있습니다.');
    expect(markup).toContain('block');
    expect(markup).toContain('href="/mypage/orders/cancel"');
    expect(markup).toContain('bg-[var(--primitive-primary-500)]');
    expect(markup).not.toContain('/images/mypage/order-cancel-complete.svg');
    expect(markup).toContain('-left-1');
  });
});
