/** 소셜 로그인 화면이 지원하는 제공자와 로그인 시작 경로를 검증합니다. */
import { describe, expect, it, vi } from 'vitest';

import { getSocialLoginUrl } from './social-login';

vi.mock('@/shared/config/api', () => ({
  getApiBaseUrl: () => 'http://localhost:8080',
}));

describe('getSocialLoginUrl', () => {
  it('카카오와 네이버 로그인을 API Gateway의 authorize URL에서 시작한다', () => {
    expect(getSocialLoginUrl('kakao')).toBe('http://localhost:8080/api/auth/authorize/kakao');
    expect(getSocialLoginUrl('naver')).toBe('http://localhost:8080/api/auth/authorize/naver');
  });
});
