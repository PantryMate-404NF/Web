import type { ProductDetail, RelatedProduct } from './types';

export const productMocks: ProductDetail[] = [
  {
    id: 'organic-broccoli',
    category: '채소·샐러드',
    name: '국산 유기농 브로콜리 1kg',
    summary: '구성: 1개 · 용량: 1kg · 원산지: 국내산',
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
  {
    id: 'sweet-banana',
    category: '과일',
    name: '에콰도르산 달콤 바나나',
    summary: '구성: 1송이 · 용량: 600g · 원산지: 에콰도르산',
    price: 3480,
    reviewCount: 152,
    rating: 4,
    isAvailable: true,
    delivery: '내일 오전 7시 이전 도착 예정',
    deliveryFee: '3,000원 (4만원 이상 무료)',
    seller: '프레시마켓',
    storageMethod: '실온',
    saleUnit: '1송이',
    weight: '600g',
    origin: '에콰도르산',
  },
  {
    id: 'fresh-milk',
    category: '유제품',
    name: '신선한 우유',
    summary: '구성: 1개 · 용량: 900ml · 원산지: 국내산',
    price: 2980,
    reviewCount: 89,
    rating: 4,
    isAvailable: true,
    delivery: '내일 오전 7시 이전 도착 예정',
    deliveryFee: '3,000원 (4만원 이상 무료)',
    seller: '프레시마켓',
    storageMethod: '냉장',
    saleUnit: '1개',
    weight: '900ml',
    origin: '국산',
  },
  {
    id: 'soft-tofu',
    category: '두부·콩나물',
    name: '부드러운 두부',
    summary: '구성: 1개 · 용량: 300g · 원산지: 국내산',
    price: 1480,
    reviewCount: 67,
    rating: 4,
    isAvailable: true,
    delivery: '내일 오전 7시 이전 도착 예정',
    deliveryFee: '3,000원 (4만원 이상 무료)',
    seller: '프레시마켓',
    storageMethod: '냉장',
    saleUnit: '1개',
    weight: '300g',
    origin: '국산',
  },
];

export const homeProductMocks = productMocks.filter((product) => product.id !== 'organic-broccoli');

export const relatedProductMocks: RelatedProduct[] = [
  {
    id: 'banana-1',
    productId: 'sweet-banana',
    name: '에콰도르산 달콤 바나나',
    price: 3480,
    unitPrice: '(100g당 580원)',
  },
  {
    id: 'milk-1',
    productId: 'fresh-milk',
    name: '신선한 우유',
    price: 2980,
    unitPrice: '(100ml당 331원)',
  },
  {
    id: 'tofu-1',
    productId: 'soft-tofu',
    name: '부드러운 두부',
    price: 1480,
    unitPrice: '(100g당 493원)',
  },
];

export function getProductById(productId: string): ProductDetail | undefined {
  return productMocks.find((product) => product.id === productId);
}
