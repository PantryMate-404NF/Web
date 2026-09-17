import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn() }),
}));

import { CartOrderAction } from './cart-page';

describe('CartPage order link', () => {
  it('선택 상품을 포함한 주문서 경로로 연결한다', () => {
    const markup = renderToStaticMarkup(
      createElement(CartOrderAction, {
        cartId: 3,
        selectedItems: [
          {
            cartItemId: 10,
            id: '10',
            ingredient: '양파',
            name: '국산 양파',
            price: 5900,
            quantity: 1,
          },
        ],
      }),
    );

    expect(markup).toContain('href="/order?cartId=3&amp;items=10"');
    expect(markup).toContain('주문하기');
  });

  it('API 설정 전 로컬 상품은 개발 미리보기 주문서로 연결한다', () => {
    const markup = renderToStaticMarkup(
      createElement(CartOrderAction, {
        selectedItems: [
          { id: 'onion', ingredient: '양파', name: '국산 양파', price: 5900, quantity: 1 },
        ],
      }),
    );

    expect(markup).toContain('href="/order?preview=1&amp;items=onion"');
  });
});
