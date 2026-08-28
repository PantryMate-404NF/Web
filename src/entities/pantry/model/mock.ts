import type { PantryItem } from './types';

export const pantryItems: PantryItem[] = [
  {
    id: 'green-onion',
    name: '대파',
    expirationLabel: '소비기한 3일 남음',
    expirationStatus: 'IMMINENT',
    availability: 'AVAILABLE',
    imageAlt: '대파 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'egg',
    name: '계란',
    expirationLabel: '소비기한 7일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '계란 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1498654077810-12c0e3a1c1d7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'potato',
    name: '감자',
    expirationLabel: '소비기한 확인 필요',
    expirationStatus: 'UNREGISTERED',
    availability: 'AVAILABLE',
    imageAlt: '감자 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'milk',
    name: '우유',
    expirationLabel: '소비기한 경과',
    expirationStatus: 'EXPIRED',
    availability: 'AVAILABLE',
    imageAlt: '우유 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tofu',
    name: '두부',
    expirationLabel: '소비기한 5일 남음',
    expirationStatus: 'NORMAL',
    availability: 'UNAVAILABLE',
    imageAlt: '두부 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pork',
    name: '돼지고기',
    expirationLabel: '소비기한 2일 남음',
    expirationStatus: 'IMMINENT',
    availability: 'AVAILABLE',
    imageAlt: '돼지고기 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'carrot',
    name: '당근',
    expirationLabel: '소비기한 10일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '당근 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'mushroom',
    name: '버섯',
    expirationLabel: '소비기한 확인 필요',
    expirationStatus: 'UNREGISTERED',
    availability: 'UNAVAILABLE',
    imageAlt: '버섯 이미지 자리',
    imageUrl:
      'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=300&q=80',
  },
];
