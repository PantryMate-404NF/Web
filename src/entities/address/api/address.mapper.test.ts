import { describe, expect, it } from 'vitest';

import { toDeliveryAddress, toUserAddressRequest } from './address.mapper';

describe('address mapper', () => {
  it('백엔드 배송지 응답을 화면 모델로 변환한다', () => {
    expect(
      toDeliveryAddress({
        addressId: 12,
        recipientName: '김지웅',
        recipientPhone: '01012345678',
        zipCode: '13485',
        address: '경기도 성남시 분당구 불정로 90',
        addressDetail: '101동 1001호',
        isDefault: true,
      }),
    ).toEqual({
      id: '12',
      recipientName: '김지웅',
      phoneNumber: '01012345678',
      postalCode: '13485',
      addressLine1: '경기도 성남시 분당구 불정로 90',
      addressLine2: '101동 1001호',
      isDefault: true,
    });
  });

  it('화면 입력을 백엔드 배송지 요청 필드로 변환한다', () => {
    expect(
      toUserAddressRequest({
        recipientName: '김지웅',
        phoneNumber: '010-1234-5678',
        postalCode: '13485',
        addressLine1: '경기도 성남시 분당구 불정로 90',
        addressLine2: '101동 1001호',
        isDefault: false,
      }),
    ).toEqual({
      recipientName: '김지웅',
      recipientPhone: '010-1234-5678',
      zipCode: '13485',
      address: '경기도 성남시 분당구 불정로 90',
      addressDetail: '101동 1001호',
      isDefault: false,
    });
  });
});
