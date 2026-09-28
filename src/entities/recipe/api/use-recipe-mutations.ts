/** 레시피 조리 완료·스크랩 mutation과 캐시 갱신을 관리함 */

import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { RECIPE_SCRAPS_QUERY_KEY } from './use-scrapped-recipes-query';
import { completeCooking, scrapRecipe, unscrapRecipe } from './recipe-mutations';
import { PANTRY_QUERY_KEY } from '@/entities/pantry/api/use-pantries-query';
import { getRecipePantryMatchQueryKey } from './use-recipe-pantry-match-query';

export function invalidateScrappedRecipes(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: RECIPE_SCRAPS_QUERY_KEY });
}

export function invalidateCookingPantryMatch(queryClient: QueryClient, recipeId: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: getRecipePantryMatchQueryKey(recipeId) }),
  ]);
}

export function useRecipeMutations() {
  const queryClient = useQueryClient();
  return {
    completeCooking: useMutation({
      mutationFn: ({ recipeId, pantryItemIds }: { recipeId: string; pantryItemIds?: number[] }) =>
        completeCooking(recipeId, pantryItemIds?.length ? { pantryItemIds } : undefined),
      onSuccess: (_result, variables) => {
        if (variables.pantryItemIds?.length) {
          return invalidateCookingPantryMatch(queryClient, variables.recipeId);
        }
      },
    }),
    scrap: useMutation({
      mutationFn: scrapRecipe,
      onSuccess: () => invalidateScrappedRecipes(queryClient),
    }),
    unscrap: useMutation({
      mutationFn: unscrapRecipe,
      onSuccess: () => invalidateScrappedRecipes(queryClient),
    }),
  };
}
