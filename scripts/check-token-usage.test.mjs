import { describe, expect, it } from 'vitest';

import { findForbiddenUtilities } from './check-token-usage.mjs';

describe('findForbiddenUtilities', () => {
  it('detects forbidden arbitrary color utilities followed by class separators', () => {
    expect(findForbiddenUtilities('className="bg-[#6baa62] px-4 border-[#e9e9eb]"')).toEqual([
      'bg-[#6baa62]',
      'border-[#e9e9eb]',
    ]);
  });
});
