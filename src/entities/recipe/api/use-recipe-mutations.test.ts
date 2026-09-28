import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { invalidateCookingPantryMatch, invalidateScrappedRecipes } from './use-recipe-mutations';
import { RECIPE_SCRAPS_QUERY_KEY } from './use-scrapped-recipes-query';
import { PANTRY_QUERY_KEY } from '@/entities/pantry/api/use-pantries-query';
import { getRecipePantryMatchQueryKey } from './use-recipe-pantry-match-query';

describe('invalidateScrappedRecipes', () => {
  it('marks the shared scrap-list cache stale after a successful mutation', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(RECIPE_SCRAPS_QUERY_KEY, []);

    await invalidateScrappedRecipes(queryClient);

    expect(queryClient.getQueryState(RECIPE_SCRAPS_QUERY_KEY)?.isInvalidated).toBe(true);
  });
});

describe('invalidateCookingPantryMatch', () => {
  it('refreshes pantry and recipe-match queries after selected pantry items are consumed', async () => {
    const queryClient = new QueryClient();
    const recipeId = '42';
    queryClient.setQueryData(PANTRY_QUERY_KEY, []);
    queryClient.setQueryData(getRecipePantryMatchQueryKey(recipeId), {});

    await invalidateCookingPantryMatch(queryClient, recipeId);

    expect(queryClient.getQueryState(PANTRY_QUERY_KEY)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(getRecipePantryMatchQueryKey(recipeId))?.isInvalidated).toBe(
      true,
    );
  });
});
