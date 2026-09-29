/**
 * Access Token을 브라우저 메모리에만 저장하는 모듈.
 * localStorage·sessionStorage·Cookie에는 Access Token을 저장 X.
 */

let accessToken: string | null = null;
let authenticatedUserId: string | null = null;

/** 현재 메모리에 저장된 Access Token을 반환합니다. */
export function getAccessToken() {
  return accessToken;
}

/** 인증된 요청에 사용할 Access Token을 메모리에 저장합니다. */
export function setAccessToken(token: string) {
  accessToken = token;
  authenticatedUserId = null;
}

/** 현재 access token과 연결된 사용자 ID를 메모리에 저장합니다. */
export function setAuthenticatedUserId(userId: string) {
  authenticatedUserId = userId;
}

/** 인증 API 요청에 사용할 현재 사용자 ID를 반환합니다. */
export function getAuthenticatedUserId() {
  return authenticatedUserId;
}

/** 로그아웃 또는 재발급 실패 시 메모리의 Access Token을 제거합니다. */
export function clearAccessToken() {
  accessToken = null;
  authenticatedUserId = null;
}
