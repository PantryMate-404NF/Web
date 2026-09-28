'use client';

import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { useState } from 'react';
import { BackButton } from '@/shared/ui/back-button';
import { SystemErrorState } from '@/shared/ui/system-error-state';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

import { RecipeCard } from './recipe-list-page';

export function RecipeMorePage({
  selectedIngredientIds = [],
  title = '전체 레시피',
}: {
  selectedIngredientIds?: number[];
  title?: string;
}) {
  const ingredientIds = selectedIngredientIds;
  const [page, setPage] = useState(0);
  const { data, error, isPending, refetch } = useRecipesQuery({ page, size: 20, ingredientIds });
  const recipes = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (error) {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <header className="flex h-16 items-center px-4">
          <BackButton fallbackHref="/recipe" />
          <h1 className="text-title-3 ml-0.5 font-semibold">{title}</h1>
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
        <h1 className="text-title-3 ml-0.5 font-semibold">{title}</h1>
      </header>
      {isPending ? (
        <div className="flex flex-1 items-center justify-center" role="status">
          <span className="sr-only">레시피를 불러오는 중입니다.</span>
        </div>
      ) : recipes.length ? (
        <section
          aria-label={`${title} 목록`}
          className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pt-2 pb-8"
        >
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant="search" />
          ))}
          {totalPages > 1 ? (
            <nav
              aria-label="레시피 페이지"
              className="col-span-2 flex items-center justify-center gap-6 py-4"
            >
              <button
                disabled={page === 0}
                onClick={() => setPage((value) => value - 1)}
                type="button"
              >
                이전
              </button>
              <span aria-live="polite">
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((value) => value + 1)}
                type="button"
              >
                다음
              </button>
            </nav>
          ) : null}
        </section>
      ) : (
        <section aria-label="레시피 없음" className="flex flex-1 items-center justify-center">
          <p className="text-sm text-[var(--primitive-grey-500)]">등록된 레시피가 없어요.</p>
        </section>
      )}
      <BottomNavigation />
    </main>
  );
}
