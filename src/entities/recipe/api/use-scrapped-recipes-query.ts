import { useQuery } from '@tanstack/react-query';

import { toRecipe } from './recipe.mapper';
import { getScrappedRecipes } from './get-scrapped-recipes';

export const RECIPE_SCRAPS_QUERY_KEY = ['recipe', 'scraps'] as const;

export function useScrappedRecipesQuery() {
  return useQuery({
    queryKey: RECIPE_SCRAPS_QUERY_KEY,
    queryFn: getScrappedRecipes,
    select: (recipes) => recipes.map(toRecipe),
  });
}
