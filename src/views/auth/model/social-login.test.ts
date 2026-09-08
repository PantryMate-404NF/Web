/** 소셜 로그인 화면이 지원하는 제공자와 로그인 시작 경로를 검증합니다. */
import { describe, expect, it } from 'vitest';

import { getSocialLoginPath } from './social-login';

describe('getSocialLoginPath', () => {
  it('카카오와 네이버 로그인 시작 경로를 제공한다', () => {
    expect(getSocialLoginPath('kakao')).toBe('/api/auth/login/kakao');
    expect(getSocialLoginPath('naver')).toBe('/api/auth/login/naver');
  });
});
