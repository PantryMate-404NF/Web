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

export interface OrderHistoryMock {
  id: string;
  orderedAt: string;
  status: '결제 완료';
  items: readonly {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageSrc: string;
  }[];
  paymentMethod: '토스페이';
  paymentAmount: number;
  orderNumber: string;
  recipient: string;
  deliveryAddress: string;
  deliveryDetail: string;
  refund: {
    orderAmount: number;
    deliveryFee: number;
    estimatedAmount: number;
  };
}

export const ORDER_HISTORY_MOCK: OrderHistoryMock = {
  id: '20260901',
  orderedAt: '2026.09.01',
  status: '결제 완료',
  items: [
    {
      id: 'ketchup',
      name: '하인즈 토마토 케찹(342g)',
      price: 6300,
      quantity: 1,
      imageSrc: '/images/mypage/order-detail-tomato-ketchup.png',
    },
    {
      id: 'tomatoes',
      name: 'GAP 알찬 완숙토마토 450g(3입)',
      price: 6100,
      quantity: 1,
      imageSrc: '/images/mypage/order-detail-tomatoes.png',
    },
    {
      id: 'eggs',
      name: '완전방사 무항생제 유정란(10구)',
      price: 6700,
      quantity: 1,
      imageSrc: '/images/mypage/order-detail-eggs.png',
    },
  ],
  paymentMethod: '토스페이',
  paymentAmount: 22100,
  orderNumber: '1547521567248',
  recipient: '집밥사랑',
  deliveryAddress: '서울특별시 신선하구 맛있동 425',
  deliveryDetail: '행복빌라, 101호',
  refund: {
    orderAmount: 8980,
    deliveryFee: 3000,
    estimatedAmount: 11980,
  },
};

export function getOrderHistoryMock(orderId: string) {
  return orderId === ORDER_HISTORY_MOCK.id ? ORDER_HISTORY_MOCK : undefined;
}
