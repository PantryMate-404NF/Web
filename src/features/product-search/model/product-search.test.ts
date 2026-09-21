import { describe, expect, it } from 'vitest';

import { productSearchMocks } from '@/entities/product/model/search-mock';

import { findProductsByQuery, toCartProduct } from './product-search';

describe('findProductsByQuery', () => {
  it('returns all egg products for the related Korean search terms', () => {
    expect(findProductsByQuery(productSearchMocks, '달걀')).toHaveLength(8);
    expect(findProductsByQuery(productSearchMocks, ' 계란 ')).toHaveLength(8);
  });

  it('returns no products before a search term is submitted', () => {
    expect(findProductsByQuery(productSearchMocks, '   ')).toEqual([]);
  });
});

describe('toCartProduct', () => {
  it('creates a cart item from an available search product', () => {
    expect(toCartProduct(productSearchMocks[0])).toMatchObject({
      id: 'search-egg-1',
      name: '완전방사 무항생제 유정란',
      price: 6700,
      purchasable: true,
    });
  });

  it('does not create a cart item from a sold-out product', () => {
    const soldOutProduct = productSearchMocks.find((product) => !product.isAvailable);

    expect(soldOutProduct).toBeDefined();
    expect(toCartProduct(soldOutProduct!)).toBeNull();
  });
});
