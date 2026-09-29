import { useQuery } from '@tanstack/react-query';

import { getRecipeFilterIngredients } from './get-recipe-filter-ingredients';

export const RECIPE_FILTER_INGREDIENTS_QUERY_KEY = ['recipe', 'filter-ingredients'] as const;

export function useRecipeFilterIngredientsQuery(enabled = true) {
  return useQuery({
    queryKey: RECIPE_FILTER_INGREDIENTS_QUERY_KEY,
    queryFn: getRecipeFilterIngredients,
    enabled,
  });
}
