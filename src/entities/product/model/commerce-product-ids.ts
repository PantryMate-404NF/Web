import type { ProductId } from './types';

/** Gateway 상품 목록에서 화면 대표 상품과 정확히 일치하는 ID만 연결합니다. */
export const PRODUCT_COMMERCE_IDS: Partial<Record<ProductId, number>> = {
  'domestic-onion': 120,
  'pesticide-free-potato': 170,
  'free-range-eggs': 157,
  'garlic-cream-cheese': 2043,
  'low-sugar-plum-syrup': 200,
};
