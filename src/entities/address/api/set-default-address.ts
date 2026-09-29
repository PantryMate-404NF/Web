import { request } from '@/shared/api/http-client';

import type { UserAddressDto } from './address.dto';

export function setDefaultAddress(addressId: number) {
  return request<UserAddressDto>(`/api/users/me/addresses/${addressId}/default`, {
    method: 'PATCH',
  });
}
