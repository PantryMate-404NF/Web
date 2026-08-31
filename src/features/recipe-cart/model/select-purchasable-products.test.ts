import { describe, expect, it } from 'vitest';

import { selectPurchasableProducts } from './select-purchasable-products';

const products = [
  { id: 'rice-cake', ingredient: '떡볶이 떡', name: '쫄깃한 밀떡', price: 2980, isShortage: false },
  {
    id: 'cheese',
    ingredient: '모짜렐라 치즈',
    name: '자연치즈 모짜렐라',
    price: 4980,
    isShortage: true,
  },
  { id: 'green-onion', ingredient: '대파', name: '국내산 대파', price: 1990, isShortage: false },
];

describe('selectPurchasableProducts', () => {
  it('only returns products linked to shortage ingredients', () => {
    expect(selectPurchasableProducts(products)).toEqual([
      { id: 'cheese', ingredient: '모짜렐라 치즈', name: '자연치즈 모짜렐라', price: 4980 },
    ]);
  });
});
