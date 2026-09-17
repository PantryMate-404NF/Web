export const ORDERER_MOCK = {
  email: 'qorhvk@naver.com',
  name: '집밥사랑',
  phone: '010-1234-2222',
} as const;

export const DELIVERY_MOCK = {
  address: '서울특별시 신선하구 맛있동 425 (행복빌라, 101호)',
  detail: '없음',
  location: '문 앞에 놓아주세요',
} as const;

export const ORDER_ITEMS_MOCK = [
  { id: 'onion', ingredient: '양파', name: '국산 양파', price: 5900, quantity: 1 },
  { id: 'potato', ingredient: '감자', name: '무농약 감자', price: 6600, quantity: 2 },
] as const;
