'use client';

import { useQuery } from '@tanstack/react-query';

import type { ProductDetail } from '../model/types';
import { getProductDetail } from './get-product-detail';
import { toProductDetail } from './product.mapper';

export const PRODUCT_DETAIL_QUERY_KEY = ['product', 'detail'] as const;

export function useProductDetailQuery(
  productId: number | undefined,
  fallback: ProductDetail | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...PRODUCT_DETAIL_QUERY_KEY, productId],
    queryFn: () => {
      if (productId === undefined) throw new Error('상품 ID가 필요합니다.');
      return getProductDetail(productId);
    },
    select: (data) => {
      if (!fallback) throw new Error('상품 화면 정보가 필요합니다.');
      return toProductDetail(data, fallback);
    },
    enabled: enabled && productId !== undefined && fallback !== undefined,
    retry: false,
  });
}
