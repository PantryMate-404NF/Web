import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomeHeader } from './home-header';

describe('HomeHeader', () => {
  it('온보딩 완료 상태여도 마이페이지 이동 URL에 상태 쿼리를 추가하지 않는다', () => {
    const markup = renderToStaticMarkup(createElement(HomeHeader, { isAuthenticated: true }));

    expect(markup).toContain('href="/mypage"');
  });
});
