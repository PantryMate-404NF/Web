import { afterEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('@/shared/api/http-client', () => ({ request: requestMock }));

import { getRecipes } from './get-recipes';
import { getRecipeFilterIngredients } from './get-recipe-filter-ingredients';
import { getRecipePantryMatch } from './get-recipe-pantry-match';
import { searchRecipes } from './search-recipes';
import { completeCooking } from './recipe-mutations';
import { getRecipeRecommendations } from './get-recipe-recommendations';
import { getRecipeDetail } from './get-recipe-detail';
import { scrapRecipe, unscrapRecipe } from './recipe-mutations';

describe('new pantry and recipe API contracts', () => {
  afterEach(() => vi.clearAllMocks());

  it('requests paginated recipes and repeats ingredientIds for the selected pantry ingredients', async () => {
    await getRecipes({ page: 2, size: 12, ingredientIds: [8, 21] });

    expect(requestMock).toHaveBeenCalledWith(
      '/api/recipes?page=2&size=12&ingredientIds=8&ingredientIds=21',
    );
  });

  it('requests AI recommendations using the documented size and cook-time limit', async () => {
    await getRecipeRecommendations({ size: 20, maxMinutes: 30 });

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/recommendations?size=20&maxMinutes=30');
  });

  it('sends recommendation context when opening a recommended recipe', async () => {
    await getRecipeDetail('8821', { requestId: 'rec-123', position: 2 });

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/8821?requestId=rec-123&position=2');
  });

  it('sends recommendation context with scrap and unscrap actions', async () => {
    const context = { requestId: 'rec-123', position: 2 };
    await scrapRecipe('8821', context);
    await unscrapRecipe('8821', context);

    expect(requestMock).toHaveBeenNthCalledWith(
      1,
      '/api/recipes/8821/scrap?requestId=rec-123&position=2',
      {
        method: 'POST',
      },
    );
    expect(requestMock).toHaveBeenNthCalledWith(
      2,
      '/api/recipes/8821/scrap?requestId=rec-123&position=2',
      {
        method: 'DELETE',
      },
    );
  });

  it('searches recipes through the backend search endpoint with pagination', async () => {
    await searchRecipes({ keyword: '계란', page: 1, size: 10 });

    expect(requestMock).toHaveBeenCalledWith(
      '/api/recipes/search?keyword=%EA%B3%84%EB%9E%80&page=1&size=10',
    );
  });

  it('loads the current user’s selectable pantry ingredients', async () => {
    await getRecipeFilterIngredients();

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/filter-ingredients');
  });

  it('loads recipe-to-pantry matching records for one recipe', async () => {
    await getRecipePantryMatch('42');

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/42/pantry-match');
  });

  it('sends selected pantry item IDs with cooking completion', async () => {
    await completeCooking('42', { pantryItemIds: [100, 101] });

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/42/cook-complete', {
      method: 'POST',
      body: { pantryItemIds: [100, 101] },
    });
  });

  it('includes recommendation context with cooking completion', async () => {
    await completeCooking('8821', { requestId: 'rec-123', position: 2 });

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/8821/cook-complete', {
      method: 'POST',
      body: { requestId: 'rec-123', position: 2 },
    });
  });

  it('omits the optional cooking-completion body when no pantry items are selected', async () => {
    await completeCooking('42');

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/42/cook-complete', { method: 'POST' });
  });
});
