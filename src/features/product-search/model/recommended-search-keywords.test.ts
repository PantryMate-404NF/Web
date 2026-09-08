import { describe, expect, it } from 'vitest';

import { preventSearchSubmit, selectRecommendedKeyword } from './recommended-search-keywords';

describe('selectRecommendedKeyword', () => {
  it('uses the selected recommended keyword as the search input value', () => {
    expect(selectRecommendedKeyword('카레가루')).toBe('카레가루');
  });
});

describe('preventSearchSubmit', () => {
  it('prevents the wireframe search form from reloading the page', () => {
    let defaultPrevented = false;

    preventSearchSubmit({
      preventDefault() {
        defaultPrevented = true;
      },
    });

    expect(defaultPrevented).toBe(true);
  });
});
