/** 카카오·네이버 OAuth를 시작하는 백엔드 경로를 정의합니다. */
export type SocialLoginProvider = 'kakao' | 'naver';

export function getSocialLoginPath(provider: SocialLoginProvider): string {
  return `/api/auth/login/${provider}`;
}
