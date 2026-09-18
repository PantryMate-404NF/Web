import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyTrackingNumber } from './delivery-tracking-copy-button';

describe('copyTrackingNumber', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('운송장번호를 클립보드에 복사한다', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await copyTrackingNumber('441481641546');

    expect(writeText).toHaveBeenCalledWith('441481641546');
  });
});
