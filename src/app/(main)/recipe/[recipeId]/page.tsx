import { RecipeDetailPage } from '@/views/recipe/ui/recipe-detail-page';

interface RecipeDetailRouteProps {
  params: Promise<{ recipeId: string }>;
  searchParams: Promise<{ requestId?: string; position?: string }>;
}

export default async function RecipeDetailRoute({ params, searchParams }: RecipeDetailRouteProps) {
  const [{ recipeId }, query] = await Promise.all([params, searchParams]);
  const position = Number(query.position);

  return (
    <RecipeDetailPage
      recipeId={recipeId}
      recommendationContext={
        query.requestId && Number.isFinite(position)
          ? { requestId: query.requestId, position }
          : undefined
      }
    />
  );
}
