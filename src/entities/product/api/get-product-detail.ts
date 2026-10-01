import { request } from '@/shared/api/http-client';

import type { ProductDetailDto } from './product.dto';

export function getProductDetail(productId: number) {
  return request<ProductDetailDto>(`/api/products/${productId}`, { auth: false });
}
