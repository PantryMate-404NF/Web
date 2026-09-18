import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { OrderDetailPage } from './order-cancel-list-page';

describe('OrderCancelListPage', () => {
  it('취소 완료 상품과 상품 수를 표시하고 재취소 버튼은 표시하지 않는다', () => {
    const markup = renderToStaticMarkup(<OrderDetailPage orderId="20260901" />);

    expect(markup).toContain('취소 완료');
    expect(markup).toContain('3개');
    expect(markup).toContain('flex items-center justify-between px-4');
    expect(markup).toContain('하인즈 토마토 케찹(342g)');
    expect(markup).toContain('6,300원');
    expect(markup).not.toContain('href="/mypage/orders/20260901/cancel"');
  });
});
