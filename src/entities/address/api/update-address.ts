import { request } from '@/shared/api/http-client';

import type { UserAddressDto, UserAddressUpdateRequestDto } from './address.dto';

export function updateAddress(addressId: number, payload: UserAddressUpdateRequestDto) {
  return request<UserAddressDto>(`/api/users/me/addresses/${addressId}`, {
    body: payload,
    method: 'PATCH',
  });
}
