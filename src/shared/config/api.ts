/**
 * 환경별 백엔드 API 기본 주소를 검증해 제공합니다.
 * 로컬에서는 HTTP 주소를 허용하고, production 빌드에서는 HTTPS 주소만 허용합니다.
 */
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수가 필요합니다.');
}

let parsedApiBaseUrl: URL;

try {
  parsedApiBaseUrl = new URL(apiBaseUrl);
} catch {
  throw new Error('NEXT_PUBLIC_API_BASE_URL은 유효한 URL이어야 합니다.');
}

const localHostnames = new Set(['localhost', '127.0.0.1', '[::1]']);
const isLocalApiServer = localHostnames.has(parsedApiBaseUrl.hostname);

if (
  process.env.NODE_ENV === 'production' &&
  !isLocalApiServer &&
  parsedApiBaseUrl.protocol !== 'https:'
) {
  throw new Error('운영 환경의 API 주소는 HTTPS여야 합니다.');
}

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, '');
