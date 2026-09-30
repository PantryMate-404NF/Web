import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { ProductCartOptionSheet } from './product-cart-option-sheet';

describe('ProductCartOptionSheet', () => {
  it('상품 옵션과 장바구니 담기 동작을 대화상자로 제공한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('유정란 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(
      createElement(ProductCartOptionSheet, {
        onAdd: vi.fn(),
        onClose: vi.fn(),
        onQuantityChange: vi.fn(),
        product,
        quantities: {
          'extra-large-10': 0,
          'king-10': 0,
          'large-10': 1,
        },
      }),
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('대란 10구 (520g)');
    expect(markup).toContain('특란 10구 (600g)');
    expect(markup).toContain('왕란 10구 (680g)');
    expect(markup).toContain('aria-label="옵션 선택 닫기"');
    expect(markup).toContain('장바구니 담기');
  });

  it('요청 중 상태를 보이는 문구와 접근 가능한 이름으로 제공한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('유정란 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(
      createElement(ProductCartOptionSheet, {
        isPending: true,
        onAdd: vi.fn(),
        onClose: vi.fn(),
        onQuantityChange: vi.fn(),
        product,
        quantities: { 'large-10': 1 },
      }),
    );

    expect(markup).toContain('aria-label="장바구니 담기 처리 중"');
    expect(markup).toContain('처리 중');
  });

  it('이미 장바구니에 반영된 옵션의 수량 변경을 잠근다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('유정란 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(
      createElement(ProductCartOptionSheet, {
        lockedOptionIds: ['large-10'],
        onAdd: vi.fn(),
        onClose: vi.fn(),
        onQuantityChange: vi.fn(),
        product,
        quantities: { 'large-10': 1 },
      }),
    );

    expect(markup).toContain('대란 10구 (520g) 장바구니 반영 완료');
    expect(markup).toContain('이미 담긴 옵션');
  });
});
