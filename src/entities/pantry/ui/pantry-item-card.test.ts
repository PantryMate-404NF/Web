import { describe, expect, it } from 'vitest';

import { getExpirationBadgeLabel, getExpirationStatusLabel } from './pantry-item-card';

describe('getExpirationStatusLabel', () => {
  it('uses the compact expiration badge copy used by the icon card wireframe', () => {
    expect(getExpirationStatusLabel('IMMINENT')).toBe('임박');
  });
});

describe('getExpirationBadgeLabel', () => {
  it('converts a remaining-day label to compact D-day copy', () => {
    expect(getExpirationBadgeLabel('소비기한 3일 남음', 'NORMAL')).toBe('D-3');
    expect(getExpirationBadgeLabel('소비기한 경과', 'EXPIRED')).toBe('경과');
  });
});
