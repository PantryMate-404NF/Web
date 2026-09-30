import { useQuery } from '@tanstack/react-query';

import { getRecipeRecommendations } from './get-recipe-recommendations';

export const RECIPE_RECOMMENDATIONS_QUERY_KEY = ['recipe', 'recommendations'] as const;

export function getRecipeRecommendationsQueryKey(size: number, includePantry: boolean) {
  return [...RECIPE_RECOMMENDATIONS_QUERY_KEY, size, includePantry] as const;
}

export function useRecipeRecommendationsQuery(enabled = true, size = 20, includePantry = true) {
  return useQuery({
    queryKey: getRecipeRecommendationsQueryKey(size, includePantry),
    queryFn: () => getRecipeRecommendations({ size, maxMinutes: 30, includePantry }),
    enabled,
  });
}
