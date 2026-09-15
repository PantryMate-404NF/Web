import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  getHomeMockState,
  getOnboardingHref,
  HomeCategoryNavigation,
  HOME_CATEGORIES,
} from './home-page';

describe('HOME_CATEGORIES', () => {
  it('로그인 완료 홈에서 Figma 순서의 카테고리를 제공한다', () => {
    expect(HOME_CATEGORIES).toEqual([
      '오늘의 채소',
      '베스트',
      '간편식',
      '계란 · 알류',
      '쌀 · 잡곡 · 견과',
      '돼지고기 · 소고기',
      '생선 · 해산물 · 건어물',
      '소스 · 양념',
    ]);
  });

  it('검색 동작이 정의되기 전에는 카테고리를 링크로 렌더링하지 않는다', () => {
    const markup = renderToStaticMarkup(createElement(HomeCategoryNavigation));

    expect(markup).not.toContain('<a');
    expect(markup).not.toContain('<nav');
  });
});

describe('getHomeMockState', () => {
  it('상태값이 없으면 비회원 온보딩 미완료 화면을 사용한다', () => {
    expect(getHomeMockState()).toBe('guest');
  });

  it('로그인했지만 온보딩이 미완료된 상태를 구분한다', () => {
    expect(getHomeMockState('onboarding')).toBe('onboarding');
  });

  it('완료 상태에서만 개인화 홈 화면을 사용한다', () => {
    expect(getHomeMockState('complete')).toBe('complete');
  });
});

describe('getOnboardingHref', () => {
  it('비회원은 로그인으로, 로그인한 미완료 사용자는 온보딩으로 이동시킨다', () => {
    expect(getOnboardingHref('guest')).toBe('/login');
    expect(getOnboardingHref('onboarding')).toBe('/onboarding');
  });
});
