import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn() }),
}));

import { CartOrderAction, CartPage } from './cart-page';

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

describe('CartPage unauthorized state', () => {
  it('비로그인 사용자에게 로그인 이동 링크를 제공하고 재시도 버튼은 표시하지 않는다', () => {
    const markup = renderToStaticMarkup(<CartPage isUnauthorized />);

    expect(markup).toContain('로그인 후 장바구니를 이용해 주세요.');
    expect(markup).toContain('href="/login"');
    expect(markup).not.toContain('다시 시도');
  });
});
