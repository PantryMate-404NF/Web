import { http, HttpResponse } from 'msw';

import type {
  UserAddressCreateRequestDto,
  UserAddressDto,
  UserAddressUpdateRequestDto,
} from '@/entities/address/api/address.dto';
import type { ApiSuccessResponse } from '@/shared/api/api-response';

let nextAddressId = 1;
const addressesByUser = new Map<string, UserAddressDto[]>();

function getUserKey(request: Request) {
  return request.headers.get('Authorization') ?? request.headers.get('X-User-Id') ?? 'anonymous';
}

function getAddresses(request: Request) {
  const userKey = getUserKey(request);
  const addresses = addressesByUser.get(userKey) ?? [];
  addressesByUser.set(userKey, addresses);
  return addresses;
}

function successResponse<T>(data: T, message: string): ApiSuccessResponse<T> {
  return {
    status: 'SUCCESS',
    message,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

function sortAddresses(addresses: UserAddressDto[]) {
  return [...addresses].sort((left, right) => Number(right.isDefault) - Number(left.isDefault));
}

export function resetAddressMock() {
  nextAddressId = 1;
  addressesByUser.clear();
}

export const addressHandlers = [
  http.get('*/api/users/me/addresses', ({ request }) => {
    return HttpResponse.json(
      successResponse(sortAddresses(getAddresses(request)), '배송지 목록 조회 성공'),
    );
  }),
  http.get('*/api/users/me/addresses/default', ({ request }) => {
    const address = getAddresses(request).find((item) => item.isDefault) ?? null;
    return HttpResponse.json(successResponse(address, '기본 배송지 조회 성공'));
  }),
  http.post('*/api/users/me/addresses', async ({ request }) => {
    const payload = (await request.json()) as UserAddressCreateRequestDto;
    const addresses = getAddresses(request);
    const shouldSetDefault = addresses.length === 0 || payload.isDefault;

    if (shouldSetDefault) {
      addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    const address: UserAddressDto = {
      addressId: nextAddressId++,
      recipientName: payload.recipientName,
      recipientPhone: payload.recipientPhone.replaceAll(/\D/g, ''),
      zipCode: payload.zipCode,
      address: payload.address,
      addressDetail: payload.addressDetail,
      isDefault: shouldSetDefault,
    };
    addresses.unshift(address);

    return HttpResponse.json(successResponse(address, '배송지 등록 성공'), { status: 201 });
  }),
  http.patch('*/api/users/me/addresses/:addressId/default', ({ params, request }) => {
    const addressId = Number(params.addressId);
    const addresses = getAddresses(request);
    const selectedAddress = addresses.find((item) => item.addressId === addressId);

    if (!selectedAddress) return new HttpResponse(null, { status: 404 });

    addresses.forEach((address) => {
      address.isDefault = address.addressId === addressId;
    });
    return HttpResponse.json(successResponse(selectedAddress, '기본 배송지 설정 성공'));
  }),
  http.patch('*/api/users/me/addresses/:addressId', async ({ params, request }) => {
    const addressId = Number(params.addressId);
    const addresses = getAddresses(request);
    const selectedAddress = addresses.find((item) => item.addressId === addressId);

    if (!selectedAddress) return new HttpResponse(null, { status: 404 });

    const payload = (await request.json()) as UserAddressUpdateRequestDto;
    Object.assign(selectedAddress, {
      recipientName: payload.recipientName,
      recipientPhone: payload.recipientPhone.replaceAll(/\D/g, ''),
      zipCode: payload.zipCode,
      address: payload.address,
      addressDetail: payload.addressDetail,
    });
    return HttpResponse.json(successResponse(selectedAddress, '배송지 수정 성공'));
  }),
];
