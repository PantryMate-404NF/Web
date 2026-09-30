import { describe, expect, it } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { HOME_PRODUCT_SECTIONS } from './home-content';

describe('home content links', () => {
  it('피그마의 레일별 상품명 색상 역할을 제공한다', () => {
    expect(HOME_PRODUCT_SECTIONS.map((section) => section.productNameTone)).toEqual([
      'primary',
      'secondary',
      'secondary',
    ]);
  });

  it('홈 상품 카드마다 대응하는 상품 상세 목업을 제공한다', () => {
    const items = HOME_PRODUCT_SECTIONS.flatMap((section) => section.items);

    expect(items.every((item) => getProductById(item.id)?.name === item.name)).toBe(true);
  });
});
