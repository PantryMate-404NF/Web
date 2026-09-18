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
    expect(markup).toContain('결제하기');
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

describe('CartPage design states', () => {
  const item = {
    id: 'egg',
    ingredient: '10구',
    name: '완전방사 무항생제 유정란',
    price: 5900,
    quantity: 2,
    thumbnailUrl: '/images/product-detail/free-range-eggs-thumb.png',
  };

  it('선택 상품의 이미지, 선택 개수와 결제 금액을 표시한다', () => {
    const markup = renderToStaticMarkup(<CartPage items={[item]} />);

    expect(markup).toContain('전체 선택 1/1');
    expect(markup).toContain('완전방사 무항생제 유정란 이미지');
    expect(markup).toContain('11,800원');
    expect(markup).toContain('14,800');
    expect(markup).toContain('결제하기');
    expect(markup).toContain('src="/icons/cart/info.svg"');
    expect(markup).not.toContain('alt="배송비 안내"');
  });

  it('빈 장바구니에 피그마 빈 상태를 표시한다', () => {
    const markup = renderToStaticMarkup(<CartPage items={[]} />);

    expect(markup).toContain('/images/pantry/empty-image.svg');
    expect(markup).not.toContain('empty-cart.png');
    expect(markup).toContain('장바구니가 비어있어요');
    expect(markup).toContain('필요한 식재료를 담고 한 번에');
    expect(markup).not.toContain('레시피 보러 가기');
  });
});
