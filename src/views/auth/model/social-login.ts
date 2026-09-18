import { getApiBaseUrl } from '@/shared/config/api';

/** 카카오·네이버 OAuth를 시작하는 백엔드 BFF 경로를 정의 */
export type SocialLoginProvider = 'kakao' | 'naver';

/** 브라우저를 API Gateway BFF의 authorize endpoint로 이동시키는 URL
 * OAuth 제공자 키와 인가 코드 교환은 백엔드가 담당하므로 프론트에서는 비밀 키를 두지 않음
 */
export function getSocialLoginUrl(provider: SocialLoginProvider): string {
  return `${getApiBaseUrl()}/api/auth/authorize/${provider}`;
}
