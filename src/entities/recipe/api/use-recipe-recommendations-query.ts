import { useQuery } from '@tanstack/react-query';

import { getRecipeRecommendations } from './get-recipe-recommendations';

export const RECIPE_RECOMMENDATIONS_QUERY_KEY = ['recipe', 'recommendations'] as const;

export function useRecipeRecommendationsQuery(enabled = true, size = 20) {
  return useQuery({
    queryKey: [...RECIPE_RECOMMENDATIONS_QUERY_KEY, size],
    queryFn: () => getRecipeRecommendations({ size, maxMinutes: 30 }),
    enabled,
  });
}
