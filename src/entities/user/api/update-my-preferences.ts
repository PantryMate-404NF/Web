/** 현재 온보딩 선택값을 완전 교체 방식으로 저장합니다. */

import { request } from '@/shared/api/http-client';

import type { UserPreference, UserPreferenceUpdateRequest } from './user-preference.dto';

export function updateMyPreferences(body: UserPreferenceUpdateRequest) {
  return request<UserPreference>('/api/users/me/preferences', {
    body,
    method: 'PUT',
  });
}
