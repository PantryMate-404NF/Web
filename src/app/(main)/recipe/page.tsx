import { RecipeListPage } from '@/views/recipe/ui/recipe-list-page';

export default async function RecipeRoute({
  searchParams,
}: {
  searchParams: Promise<{ ingredientIds?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawIngredientIds = Array.isArray(params.ingredientIds)
    ? params.ingredientIds
    : params.ingredientIds
      ? [params.ingredientIds]
      : [];

  return (
    <RecipeListPage selectedIngredientIds={rawIngredientIds.map(Number).filter(Number.isFinite)} />
  );
}
