import { describe, expect, it } from 'vitest';

import { selectRecommendedKeyword } from './recommended-search-keywords';

describe('selectRecommendedKeyword', () => {
  it('uses the selected recommended keyword as the search input value', () => {
    expect(selectRecommendedKeyword('카레가루')).toBe('카레가루');
  });
});
