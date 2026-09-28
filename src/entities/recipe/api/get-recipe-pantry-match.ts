import { request } from '@/shared/api/http-client';

import type { RecipePantryMatchDto } from './recipe.dto';

export function getRecipePantryMatch(recipeId: string) {
  return request<RecipePantryMatchDto>(`/api/recipes/${recipeId}/pantry-match`);
}
