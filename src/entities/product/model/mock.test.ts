import { describe, expect, it } from 'vitest';

import { getProductById, productMocks } from './mock';

describe('getProductById', () => {
  it('상품 ID에 해당하는 상세 목업을 반환한다', () => {
    expect(getProductById('organic-broccoli')).toMatchObject({
      id: 'organic-broccoli',
      name: '국산 유기농 브로콜리 1kg',
      isAvailable: false,
    });
  });

  it('알 수 없는 상품 ID면 첫 번째 목업을 반환한다', () => {
    expect(getProductById('unknown-product')).toEqual(productMocks[0]);
  });
});
