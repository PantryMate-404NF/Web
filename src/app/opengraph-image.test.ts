import { describe, expect, it } from 'vitest';

import OpenGraphImage, { alt, contentType, size } from './opengraph-image';

describe('open graph image metadata', () => {
  it('공유 이미지의 규격과 대체 텍스트를 제공한다', () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
    expect(alt).toBe('PantryMate 링크 공유 이미지');
  });

  it('피그마 마스코트를 포함한 PNG를 생성한다', async () => {
    const response = await OpenGraphImage();
    const image = await response.arrayBuffer();

    expect(response.headers.get('content-type')).toContain('image/png');
    expect(image.byteLength).toBeGreaterThan(100_000);
  });
});
