import { request } from '@/shared/api/http-client';

import type { UserAddressDto } from './address.dto';

export function getDefaultAddress() {
  return request<UserAddressDto | null>('/api/users/me/addresses/default');
}
