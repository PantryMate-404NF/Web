import { describe, expect, it } from 'vitest';

import { getSkeletonClassName } from './skeleton';

describe('getSkeletonClassName', () => {
  it('keeps a standard skeleton surface static by default', () => {
    expect(getSkeletonClassName()).toBe('skeleton');
  });

  it('adds the sweep effect only when explicitly requested', () => {
    expect(getSkeletonClassName(true)).toBe('skeleton skeleton--animated');
  });
});
