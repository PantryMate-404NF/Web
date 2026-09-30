import { request } from '@/shared/api/http-client';

import type { UserProfile, UserProfileUpdateRequest } from './user.dto';

export function updateMyProfile(body: UserProfileUpdateRequest) {
  return request<UserProfile>('/api/users/me', {
    body,
    method: 'PATCH',
  });
}
