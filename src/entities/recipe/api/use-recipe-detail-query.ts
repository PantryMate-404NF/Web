/** 단일 레시피 상세 서버 상태를 관리함 */

import { useQuery } from '@tanstack/react-query';
import { toRecipeDetail } from './recipe.mapper';
import { getRecipeDetail } from './get-recipe-detail';

export const RECIPE_DETAIL_QUERY_KEY = ['recipe', 'detail'] as const;

export function getRecipeDetailQueryKey(recipeId: string) {
  return [...RECIPE_DETAIL_QUERY_KEY, recipeId] as const;
}

export function useRecipeDetailQuery(recipeId: string) {
  return useQuery({
    queryKey: getRecipeDetailQueryKey(recipeId),
    queryFn: () => getRecipeDetail(recipeId),
    select: toRecipeDetail,
  });
}
