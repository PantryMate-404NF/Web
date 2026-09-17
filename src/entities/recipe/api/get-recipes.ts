/** 공개 레시피 목록 조회 요청 담당함 */

import { request } from '@/shared/api/http-client';
import type { RecipeDto } from './recipe.dto';

export function getRecipes() {
  return request<RecipeDto[]>('/api/recipes');
}
