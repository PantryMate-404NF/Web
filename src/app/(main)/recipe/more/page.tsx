import { RecipeMorePage } from '@/views/recipe/ui/recipe-more-page';

interface RecipeMoreRouteProps {
  searchParams: Promise<{ section?: string }>;
}

export default async function RecipeMoreRoute({ searchParams }: RecipeMoreRouteProps) {
  const { section } = await searchParams;

  return <RecipeMorePage sectionId={section} />;
}
