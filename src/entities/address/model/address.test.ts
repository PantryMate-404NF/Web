import { describe, expect, it } from 'vitest';

import {
  addDeliveryAddress,
  buildAddressFormHref,
  buildAddressListHref,
  getSafeOrderReturnTo,
  type DeliveryAddress,
} from './address';

const currentAddress: DeliveryAddress = {
  id: 'home',
  recipientName: '집밥사랑',
  phoneNumber: '010-1234-2222',
  addressLine1: '서울특별시 신선하구 맛있동 425',
  addressLine2: '101호',
  postalCode: '13485',
  isDefault: true,
};

describe('delivery address model', () => {
  it('새 기본 배송지를 추가하면 기존 배송지의 기본 상태를 해제한다', () => {
    const addresses = addDeliveryAddress([currentAddress], {
      ...currentAddress,
      id: 'office',
      recipientName: '회사',
    });

    expect(addresses).toEqual([
      { ...currentAddress, isDefault: false },
      { ...currentAddress, id: 'office', recipientName: '회사' },
    ]);
  });

  it('주문서 복귀 주소를 배송지 목록과 추가 화면에 보존한다', () => {
    const returnTo = '/order?preview=1&items=onion';

    expect(buildAddressListHref(returnTo)).toBe(
      '/mypage/addresses?returnTo=%2Forder%3Fpreview%3D1%26items%3Donion',
    );
    expect(buildAddressFormHref(returnTo)).toBe(
      '/mypage/addresses/new?returnTo=%2Forder%3Fpreview%3D1%26items%3Donion',
    );
  });

  it('주문서가 아닌 외부 복귀 주소는 사용하지 않는다', () => {
    expect(getSafeOrderReturnTo('https://example.com')).toBeUndefined();
    expect(getSafeOrderReturnTo('/mypage')).toBeUndefined();
    expect(getSafeOrderReturnTo('/order?cartId=3')).toBe('/order?cartId=3');
  });
});
