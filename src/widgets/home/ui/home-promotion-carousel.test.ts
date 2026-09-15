import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomePromotionCarousel } from './home-promotion-carousel';

describe('HomePromotionCarousel', () => {
  it('플러스 영역을 프로모션 더보기 화면으로 연결한다', () => {
    const markup = renderToStaticMarkup(createElement(HomePromotionCarousel));

    expect(markup).toContain('href="/promotion"');
    expect(markup).toContain('/ 4');
  });
});
