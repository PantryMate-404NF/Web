/** 로그인 완료 후 온보딩 상태를 판단하기 위한 내 프로필 조회 API */

import { request } from '@/shared/api/http-client';
import { UserProfile } from './user.dto';

/** access token으로 현재 로그인 사용자의 프로필을 조회 */

export function getMyProfile() {
  return request<UserProfile>('/api/users/me');
}
