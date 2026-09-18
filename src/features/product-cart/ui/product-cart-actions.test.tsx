import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { ProductCartActions } from './product-cart-actions';

describe('ProductCartActions', () => {
  it('판매 불가 상품의 장바구니 버튼을 비활성화한다', () => {
    const product = getProductById('organic-broccoli');

    if (!product) throw new Error('판매 불가 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(createElement(ProductCartActions, { product }));

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('판매 불가 상품은 장바구니에 담을 수 없습니다');
  });
});
