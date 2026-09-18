import { describe, expect, it } from 'vitest';

import type { CartResponseDto } from '@/entities/cart/api/cart.dto';

import { removeCartItemsFromCache, updateCartItemInCache } from './cart-cache';

const cart: CartResponseDto = {
  cartId: 3,
  items: [
    {
      cartItemId: 10,
      price: 3900,
      productId: 101,
      productName: '양파',
      purchasable: true,
      quantity: 1,
      status: 'ON_SALE',
      thumbnailUrl: '',
    },
    {
      cartItemId: 12,
      price: 4500,
      productId: 102,
      productName: '감자',
      purchasable: true,
      quantity: 2,
      status: 'ON_SALE',
      thumbnailUrl: '',
    },
  ],
};

describe('cart query cache', () => {
  it('변경 응답의 수량을 해당 장바구니 항목에 반영한다', () => {
    expect(updateCartItemInCache(cart, { cartItemId: 10, productId: 101, quantity: 3 })).toEqual({
      ...cart,
      items: [{ ...cart.items[0], quantity: 3 }, cart.items[1]],
    });
  });

  it('삭제한 장바구니 항목들을 캐시에서 제거한다', () => {
    expect(removeCartItemsFromCache(cart, [10])).toEqual({ ...cart, items: [cart.items[1]] });
  });
});
