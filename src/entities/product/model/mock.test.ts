import { describe, expect, it } from 'vitest';

import { getProductById, homeProductMocks } from './mock';

describe('getProductById', () => {
  it('상품 ID에 해당하는 상세 목업을 반환한다', () => {
    expect(getProductById('organic-broccoli')).toMatchObject({
      id: 'organic-broccoli',
      name: '국산 유기농 브로콜리 1kg',
      isAvailable: false,
    });
  });

  it('알 수 없는 상품 ID면 undefined를 반환한다', () => {
    expect(getProductById('unknown-product')).toBeUndefined();
  });

  it('홈에 표시되는 모든 상품은 상세 목업을 가진다', () => {
    expect(homeProductMocks.every((product) => getProductById(product.id))).toBe(true);
  });
});
