import { CookingCompletePage } from '@/views/cooking/ui/cooking-complete-page';

interface CookingCompleteRouteProps {
  params: Promise<{ recipeId: string }>;
}

export default async function CookingCompleteRoute({ params }: CookingCompleteRouteProps) {
  const { recipeId } = await params;

  return <CookingCompletePage recipeId={recipeId} />;
}
