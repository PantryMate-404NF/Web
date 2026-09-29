import { describe, expect, it } from 'vitest';

import { getLocalRecipeCartProducts, getRecipeCartRequests } from './recipe-cart-selection';

describe('getRecipeCartRequests', () => {
  const ingredients = [
    {
      id: 'onion',
      name: '양파',
      amount: '1개',
      isOwned: false,
      mappedProduct: { productId: 101, productName: '국내산 양파', price: 2000, quantity: 1 },
    },
    {
      id: 'egg',
      name: '달걀',
      amount: '2개',
      isOwned: false,
      mappedProduct: { productId: 202, productName: '유정란', price: 6000, quantity: 2 },
    },
    { id: 'salt', name: '소금', amount: '약간', isOwned: false, mappedProduct: null },
  ];

  it('returns mapped products for selected ingredients only', () => {
    expect(getRecipeCartRequests(ingredients, ['egg'], 'selected')).toEqual([
      { productId: 202, quantity: 2 },
    ]);
  });

  it('returns all linked products and skips ingredients without a product mapping', () => {
    expect(getRecipeCartRequests(ingredients, [], 'all')).toEqual([
      { productId: 101, quantity: 1 },
      { productId: 202, quantity: 2 },
    ]);
  });

  it('does not add already-owned ingredients in the all-shortages action', () => {
    const ownedIngredient = {
      id: 'owned',
      name: '감자',
      amount: '1개',
      isOwned: true,
      mappedProduct: {
        productId: 303,
        productName: '국내산 감자',
        price: 2500,
        quantity: 1,
      },
    };

    expect(getRecipeCartRequests([...ingredients, ownedIngredient], [], 'all')).toEqual([
      { productId: 101, quantity: 1 },
      { productId: 202, quantity: 2 },
    ]);
    expect(getRecipeCartRequests([ownedIngredient], ['owned'], 'selected')).toEqual([
      { productId: 303, quantity: 1 },
    ]);
  });

  it('combines quantities when multiple ingredients map to the same product', () => {
    expect(
      getRecipeCartRequests(
        [
          ...ingredients.slice(0, 1),
          {
            ...ingredients[1],
            mappedProduct: { ...ingredients[1].mappedProduct!, productId: 101 },
          },
        ],
        [],
        'all',
      ),
    ).toEqual([{ productId: 101, quantity: 3 }]);
  });

  it('ignores invalid product identifiers and quantities', () => {
    expect(
      getRecipeCartRequests(
        [
          {
            id: 'invalid-product',
            name: '재료',
            amount: '1개',
            mappedProduct: { productId: 0, productName: '상품', price: 1000, quantity: 1 },
          },
          {
            id: 'invalid-quantity',
            name: '재료',
            amount: '1개',
            mappedProduct: { productId: 404, productName: '상품', price: 1000, quantity: 0 },
          },
        ],
        [],
        'all',
      ),
    ).toEqual([]);
  });

  it('adds unlinked selected ingredients to the local cart as non-purchasable entries', () => {
    expect(
      getLocalRecipeCartProducts(
        [{ id: 'salt', name: '소금', amount: '약간', mappedProduct: null }],
        ['salt'],
        'selected',
      ),
    ).toEqual([
      {
        id: 'recipe-ingredient:salt',
        ingredient: '소금',
        name: '소금 (상품 연결 전)',
        price: 0,
        purchasable: false,
      },
    ]);
  });
});
