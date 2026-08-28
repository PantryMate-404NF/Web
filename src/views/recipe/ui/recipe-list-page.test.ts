import { describe, expect, it } from 'vitest';

import { getRecipeTab } from './recipe-list-page';

describe('getRecipeTab', () => {
  it('uses imminent only when the query is explicit', () => {
    expect(getRecipeTab('imminent')).toBe('imminent');
    expect(getRecipeTab('main')).toBe('main');
    expect(getRecipeTab()).toBe('main');
  });
});
