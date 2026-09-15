import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomeHeader } from './home-header';

describe('HomeHeader', () => {
  it('온보딩 완료 상태를 마이페이지 이동 후에도 유지한다', () => {
    const markup = renderToStaticMarkup(
      createElement(HomeHeader, { isAuthenticated: true, isOnboardingComplete: true }),
    );

    expect(markup).toContain('href="/mypage?state=complete"');
  });
});
