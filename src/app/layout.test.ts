import { describe, expect, it } from 'vitest';

import { viewport } from './layout';

describe('viewport', () => {
  it('iOS Safari 상태 바를 흰색으로 표시한다', () => {
    expect(viewport.themeColor).toBe('#FFFFFF');
  });
});
