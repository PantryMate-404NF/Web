import { request } from '@/shared/api/http-client';

import type { RecipeFilterIngredientDto } from './recipe.dto';

export function getRecipeFilterIngredients() {
  return request<RecipeFilterIngredientDto[]>('/api/recipes/filter-ingredients');
}
