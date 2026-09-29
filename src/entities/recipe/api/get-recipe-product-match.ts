import { request } from '@/shared/api/http-client';

import type { RecipeProductMatchDto } from './recipe.dto';

export function getRecipeProductMatch(recipeId: string) {
  return request<RecipeProductMatchDto>(`/api/recipes/${recipeId}/product-match`);
}
