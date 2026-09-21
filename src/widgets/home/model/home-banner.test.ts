import { describe, expect, it } from 'vitest';

import {
  HOME_BANNERS,
  HOME_CAROUSEL_BANNERS,
  getNextHomeBannerIndex,
  getPreviousHomeBannerIndex,
  getSwipeHomeBannerIndex,
} from './home-banner';

describe('HOME_CAROUSEL_BANNERS', () => {
  it('홈에 노출할 두 개의 Figma 배너만 제공한다', () => {
    expect(HOME_BANNERS).toHaveLength(4);
    expect(HOME_CAROUSEL_BANNERS.map(({ id }) => id)).toEqual([
      'monthly-seasonal-food',
      'sokcho-kimchi',
    ]);
    expect(HOME_CAROUSEL_BANNERS.map(({ imageSrc }) => imageSrc)).toEqual([
      '/images/home/banner-seasonal-food.png',
      '/images/home/banner-sokcho-kimchi.png',
    ]);
  });
});

describe('getNextHomeBannerIndex', () => {
  it('두 개의 배너를 순환하고 마지막에서 첫 배너로 돌아간다', () => {
    expect(getNextHomeBannerIndex(0, HOME_CAROUSEL_BANNERS.length)).toBe(1);
    expect(getNextHomeBannerIndex(1, HOME_CAROUSEL_BANNERS.length)).toBe(0);
  });
});

describe('getPreviousHomeBannerIndex', () => {
  it('첫 배너에서 이전으로 이동하면 마지막 배너로 돌아간다', () => {
    expect(getPreviousHomeBannerIndex(0, HOME_CAROUSEL_BANNERS.length)).toBe(1);
    expect(getPreviousHomeBannerIndex(1, HOME_CAROUSEL_BANNERS.length)).toBe(0);
  });
});

describe('getSwipeHomeBannerIndex', () => {
  it('좌우로 40px 이상 움직였을 때만 해당 방향으로 배너를 이동한다', () => {
    expect(getSwipeHomeBannerIndex(0, -40, HOME_CAROUSEL_BANNERS.length)).toBe(1);
    expect(getSwipeHomeBannerIndex(0, 40, HOME_CAROUSEL_BANNERS.length)).toBe(1);
    expect(getSwipeHomeBannerIndex(0, 39, HOME_CAROUSEL_BANNERS.length)).toBe(0);
  });
});
