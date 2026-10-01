import { describe, expect, it } from 'vitest';

import { alt, contentType, size } from './twitter-image';

describe('twitter image metadata', () => {
  it('OG 이미지와 동일한 공유 규격을 제공한다', () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
    expect(alt).toBe('PantryMate 링크 공유 이미지');
  });
});
