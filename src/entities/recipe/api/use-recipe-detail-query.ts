/** 단일 레시피 상세 서버 상태를 관리함 */

import { useQuery } from '@tanstack/react-query';
import type { RecipeRecommendationContext } from './recipe.dto';
import { toRecipeDetail } from './recipe.mapper';
import { getRecipeDetail } from './get-recipe-detail';

export const RECIPE_DETAIL_QUERY_KEY = ['recipe', 'detail'] as const;

export function getRecipeDetailQueryKey(recipeId: string, context?: RecipeRecommendationContext) {
  return [
    ...RECIPE_DETAIL_QUERY_KEY,
    recipeId,
    context?.requestId ?? null,
    context?.position ?? null,
  ] as const;
}

export function useRecipeDetailQuery(recipeId: string, context?: RecipeRecommendationContext) {
  return useQuery({
    queryKey: getRecipeDetailQueryKey(recipeId, context),
    queryFn: () => getRecipeDetail(recipeId, context),
    select: toRecipeDetail,
  });
}
