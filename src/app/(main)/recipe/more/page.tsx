import { RecipeMorePage } from '@/views/recipe/ui/recipe-more-page';

export default async function RecipeMoreRoute({
  searchParams,
}: {
  searchParams: Promise<{
    ingredientIds?: string | string[];
    section?: string;
    title?: string;
  }>;
}) {
  const params = await searchParams;
  const rawIngredientIds = Array.isArray(params.ingredientIds)
    ? params.ingredientIds
    : params.ingredientIds
      ? [params.ingredientIds]
      : [];

  return (
    <RecipeMorePage
      selectedIngredientIds={rawIngredientIds.map(Number).filter(Number.isFinite)}
      sectionId={
        params.section === 'personalized' || params.section === 'recommendations'
          ? params.section
          : 'all'
      }
      title={params.title}
    />
  );
}
