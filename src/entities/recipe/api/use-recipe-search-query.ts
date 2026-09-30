import { useQuery } from '@tanstack/react-query';

import { searchRecipes } from './search-recipes';
import { toRecipePage } from './recipe.mapper';

export const RECIPE_SEARCH_QUERY_KEY = ['recipe', 'search'] as const;

export function useRecipeSearchQuery(keyword: string, page = 0, size = 20) {
  const normalizedKeyword = keyword.trim();

  return useQuery({
    queryKey: [...RECIPE_SEARCH_QUERY_KEY, normalizedKeyword, page, size],
    queryFn: () => searchRecipes({ keyword: normalizedKeyword, page, size }),
    select: toRecipePage,
    enabled: normalizedKeyword.length > 0,
  });
}
