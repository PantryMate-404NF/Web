import { describe, expect, it } from 'vitest';

import { productSearchMocks } from '@/entities/product/model/search-mock';

import {
  findProductsByQuery,
  getProductSearchViewState,
  searchMockProducts,
  toCartProduct,
} from './product-search';

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

describe('getProductSearchViewState', () => {
  it('distinguishes every search result state', () => {
    expect(getProductSearchViewState({ query: '' })).toBe('idle');
    expect(getProductSearchViewState({ isPending: true, query: '달걀' })).toBe('loading');
    expect(getProductSearchViewState({ hasError: true, query: '달걀' })).toBe('error');
    expect(getProductSearchViewState({ query: '달걀', resultCount: 0 })).toBe('empty');
    expect(getProductSearchViewState({ query: '달걀', resultCount: 8 })).toBe('success');
  });
});

describe('searchMockProducts', () => {
  it('provides an error boundary that can be reproduced before API integration', async () => {
    await expect(searchMockProducts('달걀', { previewState: 'error' })).rejects.toThrow(
      '상품 검색 결과를 불러오지 못했어요.',
    );
  });
});
