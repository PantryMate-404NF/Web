/**
 * USER API가 반환하는 사용자 프로필 계약.
 * 식별자는 정밀도 손실을 막기 위해 OpenAPI 명세와 같이 문자열로 유지.
 */

export type UserProfile = {
  userId: string;
  provider: 'KAKAO' | 'NAVER';
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};
