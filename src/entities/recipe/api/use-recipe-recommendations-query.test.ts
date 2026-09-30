import { describe, expect, it } from 'vitest';

import { getRecipeRecommendationsQueryKey } from './use-recipe-recommendations-query';

describe('getRecipeRecommendationsQueryKey', () => {
  it('separates home taste-only recommendations from pantry recommendations', () => {
    expect(getRecipeRecommendationsQueryKey(10, false)).toEqual([
      'recipe',
      'recommendations',
      10,
      false,
    ]);
    expect(getRecipeRecommendationsQueryKey(10, true)).toEqual([
      'recipe',
      'recommendations',
      10,
      true,
    ]);
  });
});
