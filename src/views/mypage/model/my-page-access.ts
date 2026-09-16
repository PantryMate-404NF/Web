import type { AuthSessionState } from '@/features/auth/model/auth-session';

/** 직접 접근한 마이페이지는 비회원만 로그인 화면으로 보냅니다. */
export function getMyPageAccessRoute(authState: AuthSessionState) {
  return authState === 'guest' ? '/login' : null;
}
