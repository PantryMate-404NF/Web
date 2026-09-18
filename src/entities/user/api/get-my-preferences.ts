/** 로그인 사용자의 온보딩 진행 상태와 저장된 선택값을 조회합니다. */

import { request } from '@/shared/api/http-client';

import type { UserPreference } from './user-preference.dto';

export function getMyPreferences() {
  return request<UserPreference>('/api/users/me/preferences');
}
