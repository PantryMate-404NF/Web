import { request } from '@/shared/api/http-client';

import type { RecipeListResponseDto, RecipeSearchParams } from './recipe.dto';

export function searchRecipes({ keyword, page = 0, size = 20 }: RecipeSearchParams) {
  const searchParams = new URLSearchParams({ keyword, page: String(page), size: String(size) });

  return request<RecipeListResponseDto>(`/api/recipes/search?${searchParams.toString()}`);
}
