import { describe, expect, it } from 'vitest';

import { toCartItem } from './cart.mapper';

describe('toCartItem', () => {
  it('API 장바구니 ID와 상품 정보를 화면 모델로 보존한다', () => {
    expect(
      toCartItem({
        cartItemId: 11,
        price: 3900,
        productId: 101,
        productName: '국내산 햇양파 1kg',
        purchasable: true,
        quantity: 2,
        status: 'ON_SALE',
        thumbnailUrl: 'https://example.com/onion.jpg',
      }),
    ).toMatchObject({
      cartItemId: 11,
      id: '11',
      name: '국내산 햇양파 1kg',
      productId: 101,
      purchasable: true,
    });
  });
});
