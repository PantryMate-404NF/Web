import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/order',
  useSearchParams: () => new URLSearchParams('preview=1&items=onion'),
}));

import type { CartItem } from '@/entities/cart/model/cart-store';

import { OrderPage, OrderSheet } from './order-page';

const orderItems: CartItem[] = [
  { id: 'onion', ingredient: '양파', name: '국산 양파', price: 5900, quantity: 1 },
  { id: 'potato', ingredient: '감자', name: '무농약 감자', price: 6600, quantity: 2 },
];

describe('OrderSheet', () => {
  it('서버 기본 배송지를 주문서에 표시한다', () => {
    const markup = renderToStaticMarkup(
      createElement(OrderSheet, {
        defaultAddress: {
          id: '12',
          recipientName: '김지웅',
          phoneNumber: '01012345678',
          addressLine1: '경기도 성남시 분당구 불정로 90',
          addressLine2: '101동 1001호',
          postalCode: '13485',
          isDefault: true,
        },
        items: orderItems,
      }),
    );

    expect(markup).toContain('경기도 성남시 분당구 불정로 90, 101동 1001호 (13485)');
  });

  it('주문서 정보와 비활성 결제 CTA를 렌더링한다', () => {
    const markup = renderToStaticMarkup(
      createElement(OrderSheet, {
        items: orderItems,
        orderReturnTo: '/order?preview=1&items=onion',
      }),
    );

    expect(markup).toContain('주문자 정보');
    expect(markup).toContain('배송지');
    expect(markup).toContain('배송 요청사항');
    expect(markup).toContain('결제 수단');
    expect(markup).toContain('22,100');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain(
      'href="/mypage/addresses?returnTo=%2Forder%3Fpreview%3D1%26items%3Donion"',
    );
  });

  it('로컬 미리보기에서는 결제 버튼과 안내를 제공한다', () => {
    const markup = renderToStaticMarkup(
      createElement(OrderSheet, {
        items: orderItems,
        paymentDisabled: true,
      }),
    );

    expect(markup).toContain('로컬 미리보기에서는 결제를 진행할 수 없어요.');
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
