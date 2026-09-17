/** 레시피 목록 서버 상태와 카드 모델 변환을 관리함 */

import { useQuery } from '@tanstack/react-query';
import { getRecipes } from './get-recipes';
import { toRecipe } from './recipe.mapper';

export const RECIPE_QUERY_KEY = ['recipe', 'list'] as const;
export function useRecipesQuery() {
  return useQuery({
    queryKey: RECIPE_QUERY_KEY,
    queryFn: getRecipes,
    select: (items) => items.map(toRecipe),
  });
}
