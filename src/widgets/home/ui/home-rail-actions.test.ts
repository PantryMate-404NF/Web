import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/features/product-cart/model/use-add-product-to-cart', () => ({
  useAddProductToCart: () => ({ addProduct: vi.fn(), isPending: false, reset: vi.fn() }),
}));

import { HOME_PRODUCT_SECTIONS } from '../model/home-content';
import { HomeProductRail } from './home-product-rail';
import { HomeRecipeRail } from './home-recipe-rail';

describe('Home rail actions', () => {
  it('상품 카드의 장바구니 아이콘만 동작 가능한 버튼으로 제공한다', () => {
    const productMarkup = renderToStaticMarkup(
      createElement(HomeProductRail, HOME_PRODUCT_SECTIONS[0]),
    );
    const recipeMarkup = renderToStaticMarkup(createElement(HomeRecipeRail));

    expect(productMarkup).toContain('국산 양파 장바구니에 담고 이동');
    expect(productMarkup).toContain('<button');
    expect(recipeMarkup).not.toContain('<button');
  });
});
