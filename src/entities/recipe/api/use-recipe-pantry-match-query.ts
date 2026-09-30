import { useQuery } from '@tanstack/react-query';

import { getRecipePantryMatch } from './get-recipe-pantry-match';

export const RECIPE_PANTRY_MATCH_QUERY_KEY = ['recipe', 'pantry-match'] as const;

export function getRecipePantryMatchQueryKey(recipeId: string) {
  return [...RECIPE_PANTRY_MATCH_QUERY_KEY, recipeId] as const;
}

export function useRecipePantryMatchQuery(recipeId: string) {
  return useQuery({
    queryKey: getRecipePantryMatchQueryKey(recipeId),
    queryFn: () => getRecipePantryMatch(recipeId),
  });
}
