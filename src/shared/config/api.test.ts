/**
 * API 기본 주소가 누락되거나 운영 환경에서 HTTP로 설정되었을 때
 * 인증 요청 전에 명확하게 실패하는지 검증합니다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadApiConfig() {
  vi.resetModules();

  return import('./api');
}

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('주소가 없으면 명시적으로 실패한다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');
    const { getApiBaseUrl } = await loadApiConfig();

    expect(() => getApiBaseUrl()).toThrow('NEXT_PUBLIC_API_BASE_URL 환경 변수가 필요합니다.');
  });

  it('운영 환경에서 HTTP 주소를 거부한다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://api.example.com');
    vi.stubEnv('NODE_ENV', 'production');
    const { getApiBaseUrl } = await loadApiConfig();

    expect(() => getApiBaseUrl()).toThrow('운영 환경의 API 주소는 HTTPS여야 합니다.');
  });

  it('로컬 개발 서버 주소는 production 빌드에서도 허용한다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8080');
    vi.stubEnv('NODE_ENV', 'production');
    const { getApiBaseUrl } = await loadApiConfig();

    expect(getApiBaseUrl()).toBe('http://localhost:8080');
  });
});
