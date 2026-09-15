import type { ProductId } from '@/entities/product/model/types';

export interface HomeProductItem {
  id: ProductId;
  imageSrc: string;
  name: string;
  price: number;
  unit: string;
}

export interface HomeProductSection {
  description: string;
  id: string;
  items: HomeProductItem[];
  productNameTone: 'primary' | 'secondary';
  title: string;
}

export const HOME_PRODUCT_SECTIONS: HomeProductSection[] = [
  {
    id: 'top-products',
    title: '지금 가장 많이 담는 TOP 10',
    description: '꼭 담아야할 신선식품',
    productNameTone: 'primary',
    items: [
      {
        id: 'domestic-onion',
        imageSrc: '/images/home/product-onion.png',
        name: '국산 양파',
        price: 5900,
        unit: '(1.5kg)',
      },
      {
        id: 'pesticide-free-potato',
        imageSrc: '/images/home/product-potato.png',
        name: '무농약이상 감자',
        price: 3000,
        unit: '(500g)',
      },
      {
        id: 'free-range-eggs',
        imageSrc: '/images/home/product-third.png',
        name: '완전방사 무항생제 유정란',
        price: 6700,
        unit: '(10구)',
      },
    ],
  },
  {
    id: 'seasonal-products',
    title: '이달의 제철 식재료',
    description: '봄 제철 식재료 유채나물과 취나물을 만나보세요.',
    productNameTone: 'secondary',
    items: [
      {
        id: 'dried-rapeseed-greens',
        imageSrc: '/images/home/product-rapeseed.png',
        name: '제주 건유채나물',
        price: 5500,
        unit: '(80g)',
      },
      {
        id: 'blanched-chwinamul',
        imageSrc: '/images/home/product-chwinamul.png',
        name: '국산 데친 생 취나물',
        price: 6300,
        unit: '(250g x 1개)',
      },
      {
        id: 'bujigaengi-greens',
        imageSrc: '/images/home/product-sixth.png',
        name: '피아골 3분나물 부지깽이',
        price: 6900,
        unit: '(160g)',
      },
    ],
  },
  {
    id: 'trending-products',
    title: '요즘 주목하는 재료',
    description: '저당·고단백·비건 음식은 이런 재료로 만들어요.',
    productNameTone: 'secondary',
    items: [
      {
        id: 'buckwheat-tofu-noodles',
        imageSrc: '/images/home/product-noodles.png',
        name: '마이노멀 국산콩 100% 메밀두부면',
        price: 5580,
        unit: '(180g x 1봉)',
      },
      {
        id: 'garlic-cream-cheese',
        imageSrc: '/images/home/product-cheese.png',
        name: '[그랑도르] 차이브&갈릭 크림치즈',
        price: 9500,
        unit: '(125g)',
      },
      {
        id: 'low-sugar-plum-syrup',
        imageSrc: '/images/home/product-ninth.png',
        name: '마이노멀 저당 매실청',
        price: 16000,
        unit: '(550g)',
      },
    ],
  },
];

export const HOME_RECIPES = [
  {
    id: 'soft-boiled-egg-jang',
    imageSrc: '/images/home/recipe-egg.png',
    saveIconSrc: '/icons/home/recipe-save-1.svg',
    name: '반숙 계란장',
    meta: '한식 · 25분',
  },
  {
    id: 'beef-bulgogi',
    imageSrc: '/images/home/recipe-bulgogi.png',
    saveIconSrc: '/icons/home/recipe-save-2.svg',
    name: '소불고기',
    meta: '한식 · 30분',
  },
  {
    id: 'braised-tofu',
    imageSrc: '/images/home/recipe-tofu.png',
    saveIconSrc: '/icons/home/recipe-save-3.svg',
    name: '두부조림',
    meta: '한식 · 20분',
  },
] as const;
