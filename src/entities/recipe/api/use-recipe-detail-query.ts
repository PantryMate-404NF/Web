/** 단일 레시피 상세 서버 상태를 관리함 */

import { useQuery } from '@tanstack/react-query';
import { getRecipeDetail } from './get-recipe-detail';

export function useRecipeDetailQuery(recipeId: string) {
  return useQuery({
    queryKey: ['recipe', 'detail', recipeId],
    queryFn: () => getRecipeDetail(recipeId),
  });
}
