import { describe, expect, it } from 'vitest';

import {
  getCartItemCount,
  getCartTotal,
  mergeCartProducts,
  removeCartProduct,
  updateCartItemQuantity,
} from './cart-store';

const cheese = {
  id: 'cheese',
  ingredient: '모짜렐라 치즈',
  name: '자연치즈 모짜렐라',
  price: 4980,
};

describe('cart model', () => {
  it('merges a product already in the cart by adding its quantity', () => {
    const items = mergeCartProducts([{ ...cheese, quantity: 1 }], [cheese]);

    expect(items).toEqual([{ ...cheese, quantity: 2 }]);
  });

  it('does not lower quantity below one', () => {
    const items = updateCartItemQuantity([{ ...cheese, quantity: 1 }], cheese.id, 0);

    expect(items).toEqual([{ ...cheese, quantity: 1 }]);
  });

  it('calculates the item count and total price', () => {
    const items = [{ ...cheese, quantity: 2 }];

    expect(getCartItemCount(items)).toBe(2);
    expect(getCartTotal(items)).toBe(9960);
  });

  it('removes an item from the cart', () => {
    expect(removeCartProduct([{ ...cheese, quantity: 1 }], cheese.id)).toEqual([]);
  });
});
