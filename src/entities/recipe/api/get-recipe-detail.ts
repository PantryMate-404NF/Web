/** 레시피 상세 조회 요청 담당함 */

import { request } from '@/shared/api/http-client';
import type { RecipeDetailDto, RecipeRecommendationContext } from './recipe.dto';

export function getRecipeDetail(recipeId: string, context?: RecipeRecommendationContext) {
  const searchParams = new URLSearchParams();
  if (context?.requestId && context.position != null) {
    searchParams.set('requestId', context.requestId);
    searchParams.set('position', String(context.position));
  }
  const query = searchParams.toString();

  return request<RecipeDetailDto>(`/api/recipes/${recipeId}${query ? `?${query}` : ''}`);
}
