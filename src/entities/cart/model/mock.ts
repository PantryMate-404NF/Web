import type { CartItem } from './cart-store';

export const CART_ITEMS_MOCK: CartItem[] = [
  {
    id: 'calorie-care-faro-chip',
    ingredient: '기본 옵션',
    name: '칼로리케어 파로칩 (콩고물,오리지날,초코)',
    price: 4500,
    quantity: 1,
    thumbnailUrl: '/images/cart/product-1.png',
  },
  {
    id: 'gap-tomato',
    ingredient: '기본 옵션',
    name: 'GAP 알찬 완숙토마토 450g(3입)',
    price: 6100,
    quantity: 1,
    thumbnailUrl: '/images/cart/product-2.png',
  },
  {
    id: 'free-range-eggs',
    ingredient: '기본 옵션',
    name: '완전방사 무항생제 유정란(10구)',
    price: 6700,
    quantity: 1,
    thumbnailUrl: '/images/cart/product-3.png',
  },
  {
    id: 'calorie-care-faro-chip-original',
    ingredient: '오리지날(20g)',
    name: '칼로리케어 파로칩 (콩고물,오리지날,초코)',
    price: 4500,
    quantity: 1,
    thumbnailUrl: '/images/cart/product-4.png',
  },
];
