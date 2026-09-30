import { describe, expect, it } from 'vitest';

import { getLocalRecipeCartProducts, getRecipeCartRequests } from './recipe-cart-selection';

describe('getRecipeCartRequests', () => {
  const productMatches = [
    {
      ingredientId: 101,
      name: '양파',
      hasIngredient: false,
      matchStatus: 'MATCHED' as const,
      product: {
        productId: 1001,
        name: '국내산 양파',
        price: 2000,
        capacity: 500,
        capacitySufficient: true,
      },
    },
    {
      ingredientId: 202,
      name: '달걀',
      hasIngredient: false,
      matchStatus: 'MATCHED' as const,
      product: {
        productId: 2002,
        name: '유정란',
        price: 6000,
        capacity: 10,
        capacitySufficient: false,
      },
    },
    { ingredientId: 303, name: '소금', hasIngredient: false, matchStatus: 'UNSUPPORTED' as const },
    {
      ingredientId: 404,
      name: '감자',
      hasIngredient: true,
      matchStatus: 'MATCHED' as const,
      product: {
        productId: 4004,
        name: '감자',
        price: 2500,
        capacity: 500,
        capacitySufficient: true,
      },
    },
  ];

  it('returns mapped products for selected ingredients only', () => {
    expect(getRecipeCartRequests(productMatches, ['202'], 'selected')).toEqual([
      { productId: 2002, quantity: 1 },
    ]);
  });

  it('adds matched shortage products once, skipping owned and unsupported ingredients', () => {
    expect(getRecipeCartRequests(productMatches, [], 'all')).toEqual([
      { productId: 1001, quantity: 1 },
      { productId: 2002, quantity: 1 },
    ]);
  });

  it('combines matched ingredients that resolve to the same product', () => {
    expect(
      getRecipeCartRequests(
        productMatches.slice(0, 2).map((match) => ({
          ...match,
          product: { ...match.product!, productId: 1001 },
        })),
        [],
        'all',
      ),
    ).toEqual([{ productId: 1001, quantity: 2 }]);
  });

  it('ignores invalid product identifiers', () => {
    expect(
      getRecipeCartRequests(
        [
          {
            ingredientId: 1,
            name: '재료',
            hasIngredient: false,
            matchStatus: 'MATCHED',
            product: { productId: 0, name: '상품', price: 1000 },
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
        [{ ingredientId: 303, name: '소금', hasIngredient: false, matchStatus: 'UNSUPPORTED' }],
        ['303'],
        'selected',
      ),
    ).toEqual([
      {
        id: 'recipe-ingredient:303',
        ingredient: '소금',
        name: '소금 (상품 연결 전)',
        price: 0,
        purchasable: false,
      },
    ]);
  });
});
