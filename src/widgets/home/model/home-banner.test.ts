import { describe, expect, it } from 'vitest';

import { HOME_BANNERS, getNextHomeBannerIndex } from './home-banner';

describe('HOME_BANNERS', () => {
  it('uses only the two approved Figma banners', () => {
    expect(HOME_BANNERS).toHaveLength(2);
  });
});

describe('getNextHomeBannerIndex', () => {
  it('moves through two banners and wraps to the first banner', () => {
    expect(getNextHomeBannerIndex(0, HOME_BANNERS.length)).toBe(1);
    expect(getNextHomeBannerIndex(1, HOME_BANNERS.length)).toBe(0);
  });
});
