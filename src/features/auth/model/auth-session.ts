import type { AuthHomeState } from './restore-auth-session';

export type AuthSessionState = 'loading' | 'guest' | AuthHomeState;

/** 동시에 시작된 인증 복구 호출이 하나의 네트워크 요청을 공유하도록 합니다. */
export function createSingleFlight<T>(action: () => Promise<T>) {
  let inFlight: Promise<T> | null = null;

  return () => {
    if (inFlight) return inFlight;

    const request = action().finally(() => {
      if (inFlight === request) inFlight = null;
    });
    inFlight = request;

    return request;
  };
}

/** 명시적 인증 상태 변경 이후에는 이전 복구 요청의 결과를 무시합니다. */
export function getApplicableRestoreState<T extends Exclude<AuthSessionState, 'loading'>>(
  restoreRevision: number,
  currentRevision: number,
  restoredState: T,
) {
  return restoreRevision === currentRevision ? restoredState : null;
}

/** 인증·온보딩 상태에 따른 로그인 완료 후 목적지를 결정합니다. */
export function getPostAuthenticationRoute(homeState: AuthHomeState) {
  return homeState === 'complete' ? '/' : '/onboarding';
}

/** 로그인 완료를 위해 쓰던 임시 쿼리만 제거하고 화면 고유 쿼리는 보존합니다. */
export function getStateFreeHref(pathname: string, searchParams: URLSearchParams) {
  if (searchParams.get('state') !== 'complete') {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  const nextSearchParams = new URLSearchParams(searchParams);
  nextSearchParams.delete('state');
  const query = nextSearchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}
