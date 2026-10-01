import { describe, expect, it } from 'vitest';

import { getProductById } from '../model/mock';
import { toProductDetail } from './product.mapper';

const fallbackProduct = getProductById('free-range-eggs');

if (!fallbackProduct) throw new Error('유정란 상품 목업이 필요합니다.');

describe('product mapper', () => {
  it('상품 상세 응답을 실제 장바구니 ID가 포함된 화면 모델로 변환한다', () => {
    expect(
      toProductDetail(
        {
          productId: 157,
          sku: '102467',
          name: '완전방사 무항생제 유정란(10구)',
          categoryId: 201,
          categoryName: null,
          price: 6700,
          unit: 'EACH',
          capacity: null,
          packageCount: null,
          origin: null,
          description: null,
          thumbnailUrl: 'https://example.com/egg.jpg',
          images: [],
          stockQuantity: 50,
          status: 'ON_SALE',
          ingredientId: 11,
        },
        fallbackProduct,
      ),
    ).toMatchObject({
      commerceProductId: 157,
      id: 'free-range-eggs',
      imageUrl: 'https://example.com/egg.jpg',
      isAvailable: true,
      name: '완전방사 무항생제 유정란(10구)',
      options: undefined,
      price: 6700,
    });
  });

  it('판매 중이어도 재고가 없으면 판매 불가로 변환한다', () => {
    const product = toProductDetail(
      {
        productId: 157,
        sku: '102467',
        name: '완전방사 무항생제 유정란(10구)',
        categoryId: 201,
        categoryName: '계란·알류',
        price: 6700,
        unit: 'EACH',
        capacity: null,
        packageCount: null,
        origin: '국내산',
        description: null,
        thumbnailUrl: null,
        images: [],
        stockQuantity: 0,
        status: 'ON_SALE',
        ingredientId: 11,
      },
      fallbackProduct,
    );

    expect(product.isAvailable).toBe(false);
  });

  it('상품 용량 단위를 사용자용 표기로 변환한다', () => {
    const product = toProductDetail(
      {
        productId: 157,
        sku: '102467',
        name: '완전방사 무항생제 유정란(10구)',
        categoryId: 201,
        categoryName: '계란·알류',
        price: 6700,
        unit: 'GRAM',
        capacity: 520,
        packageCount: 2,
        origin: '국내산',
        description: null,
        thumbnailUrl: null,
        images: [],
        stockQuantity: 50,
        status: 'ON_SALE',
        ingredientId: 11,
      },
      fallbackProduct,
    );

    expect(product.weight).toBe('520g x 2개');
  });
});
