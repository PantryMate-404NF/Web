/** 레시피 목록 서버 상태와 카드 모델 변환을 관리함 */

import { useQuery } from '@tanstack/react-query';
import type { RecipeListParams } from './recipe.dto';
import { getRecipes } from './get-recipes';
import { toRecipePage } from './recipe.mapper';

export const RECIPE_QUERY_KEY = ['recipe', 'list'] as const;
export function useRecipesQuery(params: RecipeListParams = {}) {
  const normalizedParams = {
    page: params.page ?? 0,
    size: params.size ?? 20,
    ingredientIds: [...(params.ingredientIds ?? [])].sort((a, b) => a - b),
  };

  return useQuery({
    queryKey: [...RECIPE_QUERY_KEY, normalizedParams],
    queryFn: () => getRecipes(normalizedParams),
    select: toRecipePage,
  });
}
