/**
 * OAuth callback에서 refresh 쿠키를 access token으로 교환한 뒤 사용자 상태를 복구
 * refresh token은 HttpOnly 쿠키에만 존재하며 이 모듈은 값을 읽거나 저장하지 않음
 */
import { getMyProfile } from '@/entities/user/api/get-my-profile';
import { reissueAccessToken } from '@/features/auth/api/reissue-access-token';

export type AuthHomeState = 'complete' | 'onboarding';

/** 재발급 성공 후 프로필의 온보딩 완료 여부를 홈 상태로 변환합니다. */
export async function restoreAuthSession(): Promise<AuthHomeState> {
  await reissueAccessToken();
  const profile = await getMyProfile();

  return profile.onboardingCompleted ? 'complete' : 'onboarding';
}
