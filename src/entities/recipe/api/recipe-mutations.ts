/** 레시피 조리 완료와 스크랩 변경 요청 담당함 */

import { request } from '@/shared/api/http-client';
import type {
  CookingCompleteRequestDto,
  CookingHistoryDto,
  RecipeRecommendationContext,
} from './recipe.dto';

function withRecommendationContext(path: string, context?: RecipeRecommendationContext) {
  if (!context?.requestId || context.position == null) return path;

  const searchParams = new URLSearchParams({
    requestId: context.requestId,
    position: String(context.position),
  });
  return `${path}?${searchParams.toString()}`;
}

export function completeCooking(recipeId: string, body?: CookingCompleteRequestDto) {
  return request<CookingHistoryDto>(`/api/recipes/${recipeId}/cook-complete`, {
    method: 'POST',
    ...(body ? { body } : {}),
  });
}

export function scrapRecipe(recipeId: string, context?: RecipeRecommendationContext) {
  return request<unknown>(withRecommendationContext(`/api/recipes/${recipeId}/scrap`, context), {
    method: 'POST',
  });
}

export function unscrapRecipe(recipeId: string, context?: RecipeRecommendationContext) {
  return request<unknown>(withRecommendationContext(`/api/recipes/${recipeId}/scrap`, context), {
    method: 'DELETE',
  });
}
