import { request } from '@/shared/api/http-client';

import type { RecipeDto } from './recipe.dto';

/** 로그인한 사용자가 스크랩한 레시피 목록을 조회합니다. */
export function getScrappedRecipes() {
  return request<RecipeDto[]>('/api/recipes/scraps');
}
