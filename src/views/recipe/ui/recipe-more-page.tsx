'use client';

import { useEffect } from 'react';

import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { recipeMocks } from '@/entities/recipe/model/mock';
import { useScrappedRecipeStore } from '@/entities/recipe/model/scrapped-recipe-store';
import { BackButton } from '@/shared/ui/back-button';
import { SystemErrorState } from '@/shared/ui/system-error-state';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

import { getRecipeSectionById, RecipeCard } from './recipe-list-page';

export function RecipeMorePage({ sectionId }: { sectionId?: string }) {
  const { data: apiRecipes, error, refetch } = useRecipesQuery();
  const section = getRecipeSectionById(sectionId, apiRecipes ?? recipeMocks);

  useEffect(() => {
    void useScrappedRecipeStore.persist.rehydrate();
  }, []);

  if (error) {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <header className="flex h-16 items-center px-4">
          <BackButton fallbackHref="/recipe" />
          <h1 className="text-title-3 ml-0.5 font-semibold">{section.title}</h1>
        </header>
        <SystemErrorState onRetry={() => void refetch()} title="레시피를 불러오지 못했어요" />
        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
      <header className="flex h-16 items-center px-4">
        <BackButton fallbackHref="/recipe" />
        <h1 className="text-title-3 ml-0.5 font-semibold">{section.title}</h1>
      </header>
      <section
        aria-label={`${section.title} 목록`}
        className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pt-2 pb-8"
      >
        {section.recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            rank={section.id === 'popular' || section.id === 'scrapped' ? index + 1 : undefined}
            recipe={recipe}
            variant="search"
          />
        ))}
      </section>
      <BottomNavigation />
    </main>
  );
}
