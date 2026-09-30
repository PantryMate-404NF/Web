import { toRecipe } from '@/entities/recipe/api/recipe.mapper';
import type { RecipeRecommendationsDto } from '@/entities/recipe/api/recipe.dto';

export interface HomeRecipeCardItem {
  href: string;
  id: string;
  imageSrc: string | null;
  meta: string;
  name: string;
  rank: number;
}

function getRecommendedRecipeHref(recipeId: string, requestId: string | null, position: number) {
  if (!requestId) return `/recipe/${recipeId}`;

  const searchParams = new URLSearchParams({
    requestId,
    position: String(position),
  });

  return `/recipe/${recipeId}?${searchParams.toString()}`;
}

export function toHomeRecipeCards(recommendations: RecipeRecommendationsDto): HomeRecipeCardItem[] {
  return recommendations.items.map((item) => {
    const recipe = toRecipe(item.recipe);

    return {
      id: recipe.id,
      name: recipe.name,
      imageSrc: recipe.thumbnailUrl ?? null,
      meta: `${recipe.category} · ${recipe.cookTime}`,
      rank: item.rank,
      href: getRecommendedRecipeHref(recipe.id, recommendations.requestId, item.rank),
    };
  });
}
