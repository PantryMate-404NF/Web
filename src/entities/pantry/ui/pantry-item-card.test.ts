import { describe, expect, it } from 'vitest';

import { getExpirationStatusLabel } from './pantry-item-card';

describe('getExpirationStatusLabel', () => {
  it('uses the compact expiration badge copy used by the icon card wireframe', () => {
    expect(getExpirationStatusLabel('IMMINENT')).toBe('임박');
  });
});
