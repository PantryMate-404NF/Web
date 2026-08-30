import { RecipeListPage } from '@/views/recipe/ui/recipe-list-page';

interface RecipeRouteProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function RecipeRoute({ searchParams }: RecipeRouteProps) {
  const { tab } = await searchParams;

  return <RecipeListPage tab={tab === 'imminent' ? 'imminent' : 'main'} />;
}
