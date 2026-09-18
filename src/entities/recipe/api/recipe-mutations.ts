/** 레시피 조리 완료와 스크랩 변경 요청 담당함 */

import { request } from '@/shared/api/http-client';
import type { CookingHistoryDto } from './recipe.dto';

export function completeCooking(recipeId: string) {
  return request<CookingHistoryDto>(`/api/recipes/${recipeId}/cook-complete`, { method: 'POST' });
}

export function scrapRecipe(recipeId: string) {
  return request<unknown>(`/api/recipes/${recipeId}/scrap`, { method: 'POST' });
}

export function unscrapRecipe(recipeId: string) {
  return request<unknown>(`/api/recipes/${recipeId}/scrap`, { method: 'DELETE' });
}
