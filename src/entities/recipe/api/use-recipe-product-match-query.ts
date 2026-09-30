import { useQuery } from '@tanstack/react-query';

import { getRecipeProductMatch } from './get-recipe-product-match';

export const RECIPE_PRODUCT_MATCH_QUERY_KEY = ['recipe', 'product-match'] as const;

export function getRecipeProductMatchQueryKey(recipeId: string) {
  return [...RECIPE_PRODUCT_MATCH_QUERY_KEY, recipeId] as const;
}

export function useRecipeProductMatchQuery(recipeId: string, enabled = true) {
  return useQuery({
    queryKey: getRecipeProductMatchQueryKey(recipeId),
    queryFn: () => getRecipeProductMatch(recipeId),
    enabled,
  });
}
