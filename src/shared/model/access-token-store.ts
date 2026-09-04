/**
 * Access Token을 브라우저 메모리에만 저장하는 모듈.
 * localStorage·sessionStorage·Cookie에는 Access Token을 저장 X.
 */

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}
