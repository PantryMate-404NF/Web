import { RecipeListPage } from '@/views/recipe/ui/recipe-list-page';

interface RecipeRouteProps {
  searchParams: Promise<{ mockPantry?: string; tab?: string }>;
}

export default async function RecipeRoute({ searchParams }: RecipeRouteProps) {
  const { mockPantry, tab } = await searchParams;

  return (
    <RecipeListPage
      tab={tab === 'imminent' ? 'imminent' : 'main'}
      mockPantryMode={
        process.env.NODE_ENV === 'development'
          ? mockPantry === 'true'
            ? 'imminent'
            : mockPantry === 'normal'
              ? 'normal'
              : null
          : null
      }
    />
  );
}
