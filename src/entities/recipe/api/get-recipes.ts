/** 공개 레시피 목록 조회 요청 담당함 */

import { request } from '@/shared/api/http-client';
import type { RecipeListParams, RecipeListResponseDto } from './recipe.dto';

export function getRecipes({ page = 0, size = 20, ingredientIds = [] }: RecipeListParams = {}) {
  const searchParams = new URLSearchParams({ page: String(page), size: String(size) });
  ingredientIds.forEach((ingredientId) =>
    searchParams.append('ingredientIds', String(ingredientId)),
  );

  return request<RecipeListResponseDto>(`/api/recipes?${searchParams.toString()}`);
}
