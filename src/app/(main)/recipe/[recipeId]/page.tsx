import { RecipeDetailPage } from '@/views/recipe/ui/recipe-detail-page';

interface RecipeDetailRouteProps {
  params: Promise<{ recipeId: string }>;
}

export default async function RecipeDetailRoute({ params }: RecipeDetailRouteProps) {
  const { recipeId } = await params;

  return <RecipeDetailPage recipeId={recipeId} />;
}
