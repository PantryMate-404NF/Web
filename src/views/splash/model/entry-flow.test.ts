import { describe, expect, it } from 'vitest';

import { getAppEntryMode, getPostSplashRoute } from './entry-flow';

describe('getPostSplashRoute', () => {
  it('스플래시 표시 이력과 관계없이 로그인 화면으로 이동한다', () => {
    expect(getPostSplashRoute()).toBe('/login');
  });
});

describe('getAppEntryMode', () => {
  it('이미 스플래시를 표시한 탭은 인증 상태와 관계없이 홈을 표시한다', () => {
    expect(getAppEntryMode(true)).toBe('home');
  });

  it('탭의 첫 진입에서만 스플래시를 표시한다', () => {
    expect(getAppEntryMode(false)).toBe('splash');
  });
});
