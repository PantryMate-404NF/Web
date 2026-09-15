import type { AuthHomeState } from './restore-auth-session';

export type AuthSessionState = 'loading' | 'guest' | AuthHomeState;

/** 인증·온보딩 상태에 따른 로그인 완료 후 목적지를 결정합니다. */
export function getPostAuthenticationRoute(homeState: AuthHomeState) {
  return homeState === 'complete' ? '/' : '/onboarding';
}
