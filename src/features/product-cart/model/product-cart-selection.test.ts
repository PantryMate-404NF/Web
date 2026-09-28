import { describe, expect, it } from 'vitest';

import type { ProductDetail, ProductOption } from '@/entities/product/model/types';

import {
  createInitialOptionQuantities,
  getSelectedCartRequests,
  selectCartProducts,
  updateOptionQuantity,
} from './product-cart-selection';

const options: ProductOption[] = [
  { id: 'large-10', label: '대란 10구 (520g)', price: 5900 },
  { id: 'extra-large-10', label: '특란 10구 (600g)', price: 6500 },
  { id: 'king-10', label: '왕란 10구 (680g)', price: 7200 },
];

const product: ProductDetail = {
  category: '계란 · 알류',
  delivery: '내일 도착 예정',
  deliveryFee: '5,000원 (3만원 이상 무료)',
  id: 'free-range-eggs',
  isAvailable: true,
  name: '완전방사 무항생제 유정란(10구)',
  options,
  origin: '국내산',
  price: 5900,
  rating: 4,
  reviewCount: 381,
  saleUnit: '1개(10구)',
  seller: '오아시스',
  storageMethod: '실온',
  summary: '구성: 1개(10구) · 용량: 520g · 원산지: 국내산',
  thumbnailUrl: '/images/product-detail/free-range-eggs-thumb.png',
  weight: '520g 이상',
};

describe('product cart selection', () => {
  it('선택한 옵션별 목 상품 ID와 수량을 별도 요청으로 만든다', () => {
    const requests = getSelectedCartRequests(
      {
        ...product,
        options: [
          {
            id: 'small',
            label: '소형',
            mockCommerceProductId: 101,
            price: 5900,
          },
          {
            id: 'large',
            label: '대형',
            mockCommerceProductId: 102,
            price: 7200,
          },
        ],
      },
      { large: 2, small: 1 },
      'mock-api',
    );

    expect(requests).toEqual([
      { optionId: 'small', productId: 101, quantity: 1 },
      { optionId: 'large', productId: 102, quantity: 2 },
    ]);
  });

  it('실제 API 식별자가 없는 옵션 선택은 요청을 만들지 않는다', () => {
    expect(
      getSelectedCartRequests(
        {
          ...product,
          commerceProductId: 99,
          options: [{ id: 'large', label: '대형', price: 7200 }],
        },
        { large: 1 },
        'api',
      ),
    ).toBeUndefined();
  });

  it('첫 번째 옵션만 수량 1로 초기화한다', () => {
    expect(createInitialOptionQuantities(options)).toEqual({
      'extra-large-10': 0,
      'king-10': 0,
      'large-10': 1,
    });
  });

  it('옵션 수량을 0 아래로 줄이지 않는다', () => {
    expect(updateOptionQuantity({ 'large-10': 0 }, 'large-10', -1)).toEqual({
      'large-10': 0,
    });
  });

  it('선택한 옵션 수량만큼 장바구니 상품을 만든다', () => {
    expect(
      selectCartProducts(product, {
        'extra-large-10': 2,
        'king-10': 0,
        'large-10': 1,
      }),
    ).toEqual([
      {
        id: 'free-range-eggs:large-10',
        ingredient: '대란 10구 (520g)',
        name: '완전방사 무항생제 유정란(10구)',
        price: 5900,
        thumbnailUrl: '/images/product-detail/free-range-eggs-thumb.png',
      },
      {
        id: 'free-range-eggs:extra-large-10',
        ingredient: '특란 10구 (600g)',
        name: '완전방사 무항생제 유정란(10구)',
        price: 6500,
        thumbnailUrl: '/images/product-detail/free-range-eggs-thumb.png',
      },
      {
        id: 'free-range-eggs:extra-large-10',
        ingredient: '특란 10구 (600g)',
        name: '완전방사 무항생제 유정란(10구)',
        price: 6500,
        thumbnailUrl: '/images/product-detail/free-range-eggs-thumb.png',
      },
    ]);
  });
});
