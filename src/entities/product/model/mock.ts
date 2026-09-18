import type { ProductDetail, ProductId, RelatedProduct } from './types';

const HOME_PRODUCT_DETAIL_INPUTS: Array<[ProductId, string, string, number, string]> = [
  ['domestic-onion', '채소', '국산 양파', 5900, '1.5kg'],
  ['pesticide-free-potato', '채소', '무농약이상 감자', 3000, '500g'],
  ['free-range-eggs', '계란·알류', '완전방사 무항생제 유정란', 6700, '10구'],
  ['dried-rapeseed-greens', '채소', '제주 건유채나물', 5500, '80g'],
  ['blanched-chwinamul', '채소', '국산 데친 생 취나물', 6300, '250g x 1개'],
  ['bujigaengi-greens', '채소', '피아골 3분나물 부지깽이', 6900, '160g'],
  ['buckwheat-tofu-noodles', '면·두부', '마이노멀 국산콩 100% 메밀두부면', 5580, '180g x 1봉'],
  ['garlic-cream-cheese', '유제품', '[그랑도르] 차이브&갈릭 크림치즈', 9500, '125g'],
  ['low-sugar-plum-syrup', '소스·양념', '마이노멀 저당 매실청', 16000, '550g'],
];

const HOME_PRODUCT_DETAILS: ProductDetail[] = HOME_PRODUCT_DETAIL_INPUTS.map(
  ([id, category, name, price, weight]) => {
    if (id === 'free-range-eggs') {
      return {
        id,
        category: '계란 · 알류',
        name: '완전방사 무항생제 유정란(10구)',
        summary: '구성: 1개(10구) · 용량: 520g · 원산지: 국내산',
        price: 5900,
        reviewCount: 381,
        rating: 4,
        isAvailable: true,
        delivery: '내일 도착 예정',
        deliveryFee: '5,000원 (3만원 이상 무료)',
        seller: '오아시스',
        storageMethod: '실온',
        saleUnit: '1개(10구)',
        weight: '520g 이상',
        origin: '국내산',
        imageUrl: '/images/product-detail/free-range-eggs-main.png',
        thumbnailUrl: '/images/product-detail/free-range-eggs-thumb.png',
        detailImageUrls: [
          '/images/product-detail/detail-1.png',
          '/images/product-detail/detail-2.png',
          '/images/product-detail/detail-3.png',
          '/images/product-detail/detail-4.png',
        ],
        options: [
          { id: 'large-10', label: '대란 10구 (520g)', price: 5900 },
          { id: 'extra-large-10', label: '특란 10구 (600g)', price: 6500 },
          { id: 'king-10', label: '왕란 10구 (680g)', price: 7200 },
        ],
      };
    }

    return {
      id,
      category,
      name,
      summary: `구성: 1개 · 용량: ${weight} · 원산지: 국내산`,
      price,
      reviewCount: 0,
      rating: 0,
      isAvailable: true,
      delivery: '내일 오전 7시 이전 도착 예정',
      deliveryFee: '3,000원 (4만원 이상 무료)',
      seller: '프레시마켓',
      storageMethod: '상품별 보관 방법 참고',
      saleUnit: '1개',
      weight,
      origin: '국산',
    };
  },
);

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
  ...HOME_PRODUCT_DETAILS,
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
