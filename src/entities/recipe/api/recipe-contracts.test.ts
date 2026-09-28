import { afterEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('@/shared/api/http-client', () => ({ request: requestMock }));

import { getRecipes } from './get-recipes';
import { getRecipeFilterIngredients } from './get-recipe-filter-ingredients';
import { getRecipePantryMatch } from './get-recipe-pantry-match';
import { searchRecipes } from './search-recipes';
import { completeCooking } from './recipe-mutations';

describe('new pantry and recipe API contracts', () => {
  afterEach(() => vi.clearAllMocks());

  it('requests paginated recipes and repeats ingredientIds for the selected pantry ingredients', async () => {
    await getRecipes({ page: 2, size: 12, ingredientIds: [8, 21] });

    expect(requestMock).toHaveBeenCalledWith(
      '/api/recipes?page=2&size=12&ingredientIds=8&ingredientIds=21',
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

  it('omits the optional cooking-completion body when no pantry items are selected', async () => {
    await completeCooking('42');

    expect(requestMock).toHaveBeenCalledWith('/api/recipes/42/cook-complete', { method: 'POST' });
  });
});
