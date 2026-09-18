import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

import type { CartItem } from '@/entities/cart/model/cart-store';

import { OrderPage, OrderSheet } from './order-page';

const orderItems: CartItem[] = [
  { id: 'onion', ingredient: '양파', name: '국산 양파', price: 5900, quantity: 1 },
  { id: 'potato', ingredient: '감자', name: '무농약 감자', price: 6600, quantity: 2 },
];

describe('OrderSheet', () => {
  it('주문서 정보와 비활성 결제 CTA를 렌더링한다', () => {
    const markup = renderToStaticMarkup(createElement(OrderSheet, { items: orderItems }));

    expect(markup).toContain('주문자 정보');
    expect(markup).toContain('배송지');
    expect(markup).toContain('배송 요청사항');
    expect(markup).toContain('결제 수단');
    expect(markup).toContain('22,100');
    expect(markup).toContain('disabled=""');
  });

  it('피그마 기준 섹션 높이와 구분선을 유지한다', () => {
    const markup = renderToStaticMarkup(createElement(OrderSheet, { items: orderItems }));

    expect(markup).toContain('min-h-14');
    expect(markup).toContain('h-[137px]');
    expect(markup).toContain('h-[129px]');
    expect(markup).toContain('h-[340px]');
    expect(markup).toContain('h-[201px]');
    expect(markup).toContain('border-y-8');
  });

  it('주문 상품이 없으면 장바구니 이동 안내를 제공한다', () => {
    const markup = renderToStaticMarkup(createElement(OrderSheet, { items: [] }));

    expect(markup).toContain('주문할 상품이 없어요');
    expect(markup).toContain('href="/cart"');
  });
});

describe('OrderPage preview', () => {
  it('개발 미리보기 상품으로 주문서를 확인할 수 있다', () => {
    const markup = renderToStaticMarkup(
      createElement(OrderPage, { items: orderItems, selectedItemIds: [] }),
    );

    expect(markup).toContain('22,100');
    expect(markup).not.toContain('주문할 상품이 없어요');
  });
});
