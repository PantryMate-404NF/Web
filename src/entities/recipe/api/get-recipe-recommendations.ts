import { request } from '@/shared/api/http-client';

import type { RecipeRecommendationParams, RecipeRecommendationsDto } from './recipe.dto';

export function getRecipeRecommendations({
  size = 20,
  maxMinutes,
}: RecipeRecommendationParams = {}) {
  const searchParams = new URLSearchParams({ size: String(size) });
  if (maxMinutes !== undefined) searchParams.set('maxMinutes', String(maxMinutes));

  return request<RecipeRecommendationsDto>(
    `/api/recipes/recommendations?${searchParams.toString()}`,
  );
}
