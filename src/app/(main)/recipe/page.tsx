import { RecipeListPage } from '@/views/recipe/ui/recipe-list-page';

export default async function RecipeRoute({
  searchParams,
}: {
  searchParams: Promise<{
    ingredientIds?: string | string[];
    pantryItemIds?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const rawIngredientIds = Array.isArray(params.ingredientIds)
    ? params.ingredientIds
    : params.ingredientIds
      ? [params.ingredientIds]
      : [];
  const rawPantryItemIds = Array.isArray(params.pantryItemIds)
    ? params.pantryItemIds
    : params.pantryItemIds
      ? [params.pantryItemIds]
      : [];

  return (
    <RecipeListPage
      selectedIngredientIds={rawIngredientIds.map(Number).filter(Number.isFinite)}
      selectedPantryItemIds={rawPantryItemIds}
    />
  );
}
