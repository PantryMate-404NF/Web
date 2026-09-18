import type { Recipe } from '@/entities/recipe/model/types';

export function selectScrappedRecipes(
  scrappedRecipeIds: readonly string[],
  recipes: readonly Recipe[],
): Recipe[] {
  const recipeById = new Map<string, Recipe>(recipes.map((recipe) => [recipe.id, recipe]));

  return scrappedRecipeIds.flatMap((recipeId) => {
    const recipe = recipeById.get(recipeId);
    return recipe ? [recipe] : [];
  });
}
