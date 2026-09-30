import { describe, expect, it } from 'vitest';

import {
  buildPaymentCompletionSnapshot,
  getPaymentCompletionCartItemIds,
} from './payment-completion';

describe('buildPaymentCompletionSnapshot', () => {
  it('주문서에서 실제 결제 상품, 회원, 배송지와 서버 금액을 주문 완료 정보로 만든다', () => {
    expect(
      buildPaymentCompletionSnapshot({
        deliveryAddress: {
          addressLine1: '서울시 강남구 테헤란로 1',
          addressLine2: '101호',
          id: 'address-1',
          isDefault: true,
          phoneNumber: '01012345678',
          postalCode: '06123',
          recipientName: '김지웅',
        },
        deliveryRequest: { detail: '없음', location: '문 앞에 놓아주세요' },
        selectedCartItemIds: [10, 12],
        items: [
          {
            id: 'cart-item-1',
            ingredient: '양파',
            name: '국산 양파',
            price: 5900,
            quantity: 2,
            thumbnailUrl: 'https://cdn.example/onion.png',
          },
        ],
        order: {
          createdAt: '2026-09-30T12:00:00',
          orderId: 'ORDER_123',
          totalAmount: 14800,
        },
        orderer: { nickname: '집밥사랑', phoneNumber: '01098765432' },
      }),
    ).toEqual({
      selectedCartItemIds: [10, 12],
      deliveryAddress: {
        addressLine1: '서울시 강남구 테헤란로 1',
        addressLine2: '101호',
        phoneNumber: '01012345678',
        postalCode: '06123',
        recipientName: '김지웅',
      },
      deliveryRequest: { detail: '없음', location: '문 앞에 놓아주세요' },
      items: [
        {
          id: 'cart-item-1',
          imageUrl: 'https://cdn.example/onion.png',
          name: '국산 양파',
          price: 5900,
          quantity: 2,
        },
      ],
      orderNumber: 'ORDER_123',
      orderedAt: '2026-09-30T12:00:00',
      orderer: { name: '집밥사랑', phoneNumber: '01098765432' },
      paymentAmount: 14800,
    });
  });
});

describe('getPaymentCompletionCartItemIds', () => {
  it('저장한 주문 선택 ID를 우선 사용한다', () => {
    expect(
      getPaymentCompletionCartItemIds({
        selectedCartItemIds: [12],
        items: [{ id: '10', name: '양파', price: 100, quantity: 1 }],
      }),
    ).toEqual([12]);
  });

  it('이전 스냅샷이면 숫자형 장바구니 항목 ID를 복원한다', () => {
    expect(
      getPaymentCompletionCartItemIds({
        items: [
          { id: '10', name: '양파', price: 100, quantity: 1 },
          { id: 'not-a-cart-id', name: '소금', price: 200, quantity: 1 },
        ],
      }),
    ).toEqual([10]);
  });
});
