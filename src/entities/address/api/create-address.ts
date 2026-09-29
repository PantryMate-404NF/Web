import { request } from '@/shared/api/http-client';

import type { UserAddressCreateRequestDto, UserAddressDto } from './address.dto';

export function createAddress(payload: UserAddressCreateRequestDto) {
  return request<UserAddressDto>('/api/users/me/addresses', { body: payload, method: 'POST' });
}
