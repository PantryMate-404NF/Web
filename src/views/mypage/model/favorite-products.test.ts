import { describe, expect, it } from 'vitest';

import { productMocks } from '@/entities/product/model/mock';

import { selectFavoriteProducts } from './favorite-products';

describe('favorite products', () => {
  it('저장된 상품 ID 순서대로 찜 목록을 만든다', () => {
    const products = selectFavoriteProducts(
      ['low-sugar-plum-syrup', 'pesticide-free-potato'],
      productMocks,
    );

    expect(products.map((product) => product.id)).toEqual([
      'low-sugar-plum-syrup',
      'pesticide-free-potato',
    ]);
  });

  it('현재 상품 데이터에 없는 ID는 목록에서 제외한다', () => {
    const products = selectFavoriteProducts(['free-range-eggs', 'removed-product'], productMocks);

    expect(products.map((product) => product.id)).toEqual(['free-range-eggs']);
  });
});
