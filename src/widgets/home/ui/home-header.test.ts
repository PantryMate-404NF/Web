import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomeHeader } from './home-header';

describe('HomeHeader', () => {
  it('브랜드 로고를 실제 크기로 표시하고 홈으로 이동시킨다', () => {
    const markup = renderToStaticMarkup(createElement(HomeHeader));

    expect(markup).toContain('href="/"');
    expect(markup).toContain('w-[151px]');
    expect(markup).toContain('width="150"');
    expect(markup).toContain('height="64"');
  });
});
