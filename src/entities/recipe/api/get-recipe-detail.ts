/** 레시피 상세 조회 요청 담당함 */

import { request } from '@/shared/api/http-client';
import type { RecipeDetailDto } from './recipe.dto';

export function getRecipeDetail(recipeId: string) {
  return request<RecipeDetailDto>(`/api/recipes/${recipeId}`);
}
