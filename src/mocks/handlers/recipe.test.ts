import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { RecipeRecommendationsDto } from '@/entities/recipe/api/recipe.dto';
import { server } from '@/mocks/server';
import type { ApiResponse } from '@/shared/api/api-response';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('recipeHandlers', () => {
  it('returns taste-only home recommendations using the requested size', async () => {
    const response = await fetch(
      'http://localhost:8080/api/recipes/recommendations?size=1&maxMinutes=30&includePantry=false',
      { headers: { Authorization: 'Bearer account-a' } },
    );
    const result = (await response.json()) as ApiResponse<RecipeRecommendationsDto>;

    expect(response.status).toBe(200);
    expect(result.data?.source).toBe('AI');
    expect(result.data?.requestId).toBeTruthy();
    expect(result.data?.items).toHaveLength(1);
    expect(result.data?.items[0]).toMatchObject({ rank: 1, recipe: { title: '반숙 계란장' } });
  });
});
