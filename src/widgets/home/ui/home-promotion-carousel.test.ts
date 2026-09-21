import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getCarouselPlaybackControl, HomePromotionCarousel } from './home-promotion-carousel';

describe('HomePromotionCarousel', () => {
  it('두 프로모션을 슬라이드 트랙에 렌더링하고 더보기 화면으로 연결한다', () => {
    const markup = renderToStaticMarkup(createElement(HomePromotionCarousel));

    expect(markup).toContain('href="/promotion"');
    expect(markup).toContain('/ 2');
    expect(markup).toContain('banner-seasonal-food.png');
    expect(markup).toContain('banner-sokcho-kimchi.png');
    expect(markup).toContain('transition-transform');
  });
});

describe('getCarouselPlaybackControl', () => {
  it('일시정지 상태에서 재생 동작과 재생 아이콘을 함께 제공한다', () => {
    expect(getCarouselPlaybackControl(true)).toEqual({
      iconSrc: '/icons/home/play.svg',
      label: '배너 자동 전환 재생',
    });
  });
});
