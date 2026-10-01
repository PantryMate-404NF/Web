import { describe, expect, it } from 'vitest';

import { PRODUCT_COMMERCE_IDS } from './commerce-product-ids';

describe('PRODUCT_COMMERCE_IDS', () => {
  it('화면 대표 상품을 확인된 백엔드 상품 ID와 연결한다', () => {
    expect(PRODUCT_COMMERCE_IDS).toMatchObject({
      'domestic-onion': 120,
      'pesticide-free-potato': 170,
      'free-range-eggs': 157,
      'garlic-cream-cheese': 2043,
      'low-sugar-plum-syrup': 200,
    });
  });
});
