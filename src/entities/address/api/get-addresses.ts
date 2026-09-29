import { request } from '@/shared/api/http-client';

import type { UserAddressDto } from './address.dto';

export function getAddresses() {
  return request<UserAddressDto[]>('/api/users/me/addresses');
}
