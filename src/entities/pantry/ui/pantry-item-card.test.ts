import { describe, expect, it } from 'vitest';

import { getExpirationStatusLabel } from './pantry-item-card';

describe('getExpirationStatusLabel', () => {
  it('converts imminent expiration status to user-facing copy', () => {
    expect(getExpirationStatusLabel('IMMINENT')).toBe('소비기한 임박');
  });
});
