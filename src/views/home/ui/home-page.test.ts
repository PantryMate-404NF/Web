import { describe, expect, it } from 'vitest';

import { getHomeMockState, HOME_CATEGORIES } from './home-page';

describe('HOME_CATEGORIES', () => {
  it('로그인 완료 홈에서 Figma 순서의 카테고리를 제공한다', () => {
    expect(HOME_CATEGORIES).toEqual([
      '오늘의 채소',
      '베스트',
      '간편식',
      '계란 · 알류',
      '쌀 · 잡곡 · 견과',
      '돼지고기 · 소고기',
    ]);
  });
});

describe('getHomeMockState', () => {
  it('상태값이 없으면 비회원 온보딩 미완료 화면을 사용한다', () => {
    expect(getHomeMockState()).toBe('onboarding');
  });

  it('완료 상태에서만 개인화 홈 화면을 사용한다', () => {
    expect(getHomeMockState('complete')).toBe('complete');
  });
});
