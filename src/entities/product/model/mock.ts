import type { ProductDetail, RelatedProduct } from './types';

export const productMocks: ProductDetail[] = [
  {
    id: 'organic-broccoli',
    category: '채소·샐러드',
    name: '국산 유기농 브로콜리 1kg',
    summary: '구성: 1개 · 용량: 500g · 원산지: 국내산',
    price: 6000,
    reviewCount: 381,
    rating: 3.5,
    isAvailable: false,
    delivery: '내일 오전 7시 이전 도착 예정',
    deliveryFee: '3,000원 (4만원 이상 무료)',
    seller: '토종마을',
    storageMethod: '실온',
    saleUnit: '1팩',
    weight: '1kg',
    origin: '국산',
  },
];

export const relatedProductMocks: RelatedProduct[] = [
  { id: 'banana-1', name: '에콰도르산 달콤 바나나', price: 3480, unitPrice: '(100g당 580원)' },
  { id: 'banana-2', name: '에콰도르산 달콤 바나나', price: 3480, unitPrice: '(100g당 580원)' },
  { id: 'banana-3', name: '에콰도르산 달콤 바나나', price: 3480, unitPrice: '(100g당 580원)' },
];

export function getProductById(productId: string): ProductDetail {
  return productMocks.find((product) => product.id === productId) ?? productMocks[0];
}
