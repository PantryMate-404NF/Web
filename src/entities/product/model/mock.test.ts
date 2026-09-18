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

  it('유정란 상품은 상세 디자인의 옵션과 판매 정보를 제공한다', () => {
    expect(getProductById('free-range-eggs')).toMatchObject({
      delivery: '내일 도착 예정',
      deliveryFee: '5,000원 (3만원 이상 무료)',
      name: '완전방사 무항생제 유정란(10구)',
      options: [
        { id: 'large-10', label: '대란 10구 (520g)', price: 5900 },
        { id: 'extra-large-10', label: '특란 10구 (600g)', price: 6500 },
        { id: 'king-10', label: '왕란 10구 (680g)', price: 7200 },
      ],
      price: 5900,
      seller: '오아시스',
      weight: '520g 이상',
    });
  });
});
