import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HOME_PRODUCT_SECTIONS } from '../model/home-content';
import { HomeProductRail } from './home-product-rail';
import { HomeRecipeRail } from './home-recipe-rail';

describe('Home rail actions', () => {
  it('동작이 정의되지 않은 카드 아이콘을 활성 버튼으로 노출하지 않는다', () => {
    const productMarkup = renderToStaticMarkup(
      createElement(HomeProductRail, HOME_PRODUCT_SECTIONS[0]),
    );
    const recipeMarkup = renderToStaticMarkup(createElement(HomeRecipeRail));

    expect(productMarkup).not.toContain('<button');
    expect(recipeMarkup).not.toContain('<button');
  });
});
