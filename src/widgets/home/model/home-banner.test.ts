import { describe, expect, it } from 'vitest';

import { HOME_BANNERS, getNextHomeBannerIndex } from './home-banner';

describe('HOME_BANNERS', () => {
  it('프로모션 더보기와 동일한 네 개의 Figma 배너를 제공한다', () => {
    expect(HOME_BANNERS).toHaveLength(4);
  });
});

describe('getNextHomeBannerIndex', () => {
  it('네 개의 배너를 순환하고 마지막에서 첫 배너로 돌아간다', () => {
    expect(getNextHomeBannerIndex(0, HOME_BANNERS.length)).toBe(1);
    expect(getNextHomeBannerIndex(3, HOME_BANNERS.length)).toBe(0);
  });
});
