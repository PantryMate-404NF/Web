'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useRecipeRecommendationsQuery } from '@/entities/recipe/api/use-recipe-recommendations-query';
import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { toRecipe } from '@/entities/recipe/api/recipe.mapper';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { ApiError } from '@/shared/api/api-error';
import { BackButton } from '@/shared/ui/back-button';
import { SystemErrorState } from '@/shared/ui/system-error-state';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

import {
  getRecipeRecommendationSectionCopy,
  getRecipeRecommendationTitle,
  RecipeCard,
} from './recipe-list-page';

const RECOMMENDATIONS_PAGE_SIZE = 10;
const RECOMMENDATIONS_FETCH_SIZE = 100;

export function RecipeMorePage({
  selectedIngredientIds = [],
  sectionId = 'all',
  title = '전체 레시피',
}: {
  selectedIngredientIds?: number[];
  sectionId?: 'all' | 'personalized' | 'recommendations';
  title?: string;
}) {
  const ingredientIds = selectedIngredientIds;
  const isPersonalized = sectionId === 'personalized';
  const isRecommendations = sectionId === 'recommendations' || isPersonalized;
  const { state: authState } = useAuthSession();
  const [page, setPage] = useState(0);
  const recipeQuery = useRecipesQuery({ page, size: 20, ingredientIds }, !isRecommendations);
  const recommendationQuery = useRecipeRecommendationsQuery(
    isRecommendations &&
      (authState === 'complete' || (!isPersonalized && authState === 'onboarding')),
    RECOMMENDATIONS_FETCH_SIZE,
    !isPersonalized,
  );
  const recommendationData = recommendationQuery.data;
  const recommendationCopy = recommendationData
    ? getRecipeRecommendationSectionCopy(
        isPersonalized ? 'personalized' : 'pantry',
        recommendationData.source,
      )
    : null;
  const pageTitle = isRecommendations
    ? isPersonalized
      ? '나를 위한 레시피'
      : recommendationData
        ? getRecipeRecommendationTitle(recommendationData.source)
        : '팬트리 기반 추천'
    : title;
  const recommendationItems = recommendationData?.items ?? [];
  const recommendationTotalPages = Math.ceil(
    recommendationItems.length / RECOMMENDATIONS_PAGE_SIZE,
  );
  const visibleRecommendationItems = recommendationItems.slice(
    page * RECOMMENDATIONS_PAGE_SIZE,
    (page + 1) * RECOMMENDATIONS_PAGE_SIZE,
  );
  const recipes = recipeQuery.data?.content ?? [];
  const totalPages = isRecommendations
    ? recommendationTotalPages
    : (recipeQuery.data?.totalPages ?? 0);
  const isPending = isRecommendations
    ? authState === 'loading' || recommendationQuery.isPending
    : recipeQuery.isPending;
  const error = isRecommendations ? recommendationQuery.error : recipeQuery.error;
  const hasRecommendationData = isRecommendations && Boolean(recommendationData);
  const loginReturnTo = isRecommendations ? `/recipe/more?section=${sectionId}` : '/recipe';

  if (isRecommendations && authState === 'guest') {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <header className="flex h-16 items-center px-4">
          <BackButton fallbackHref="/recipe" />
          <h1 className="text-title-3 ml-0.5 font-semibold">{pageTitle}</h1>
        </header>
        <section className="px-4 pt-8">
          <p className="text-body-4 text-[var(--primitive-grey-600)]">
            추천 레시피를 보려면 로그인해 주세요.
          </p>
          <Link
            className="mt-3 inline-block font-semibold"
            href={`/login?returnTo=${encodeURIComponent(loginReturnTo)}`}
          >
            로그인하기
          </Link>
        </section>
        <BottomNavigation />
      </main>
    );
  }

  if (isPersonalized && authState === 'onboarding') {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <header className="flex h-16 items-center px-4">
          <BackButton fallbackHref="/recipe" />
          <h1 className="text-title-3 ml-0.5 font-semibold">{pageTitle}</h1>
        </header>
        <section className="px-4 pt-8">
          <p className="text-body-4 text-[var(--primitive-grey-600)]">
            온보딩을 완료하면 맛 선호도를 반영한 레시피를 추천해 드려요.
          </p>
          <Link className="mt-3 inline-block font-semibold" href="/onboarding">
            온보딩 하기
          </Link>
        </section>
        <BottomNavigation />
      </main>
    );
  }

  if (error && !hasRecommendationData) {
    const isRecommendationUnavailable =
      isRecommendations && error instanceof ApiError && error.status === 503;
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <header className="flex h-16 items-center px-4">
          <BackButton fallbackHref="/recipe" />
          <h1 className="text-title-3 ml-0.5 font-semibold">{pageTitle}</h1>
        </header>
        {isRecommendationUnavailable ? (
          <section className="px-4 pt-8" role="alert">
            <p className="text-body-4 text-[var(--primitive-grey-600)]">
              알레르기 정보를 확인할 수 없어 추천을 잠시 중단했어요. 잠시 후 다시 시도해 주세요.
            </p>
            <button
              className="mt-3 font-semibold"
              onClick={() => void recommendationQuery.refetch()}
              type="button"
            >
              다시 시도
            </button>
          </section>
        ) : (
          <SystemErrorState
            onRetry={() =>
              void (isRecommendations ? recommendationQuery.refetch() : recipeQuery.refetch())
            }
            title="레시피를 불러오지 못했어요"
          />
        )}
        <BottomNavigation />
      </main>
    );
  }

  const hasRecipes = isRecommendations ? visibleRecommendationItems.length > 0 : recipes.length > 0;

  return (
    <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
      <header className="flex h-16 items-center px-4">
        <BackButton fallbackHref="/recipe" />
        <h1 className="text-title-3 ml-0.5 font-semibold">{pageTitle}</h1>
      </header>
      {isPersonalized && recommendationCopy ? (
        <p className="text-body-4 px-4 pb-3 text-[var(--primitive-grey-500)]">
          {recommendationCopy.description}
        </p>
      ) : null}
      {error && hasRecommendationData ? (
        <section className="mx-4 mb-3 rounded-xl bg-[var(--primitive-grey-50)] p-4" role="alert">
          <p className="text-body-4 text-[var(--primitive-grey-600)]">
            최신 추천을 불러오지 못했어요. 기존 추천을 표시합니다.
          </p>
          <button
            className="mt-3 font-semibold"
            onClick={() => void recommendationQuery.refetch()}
            type="button"
          >
            다시 시도
          </button>
        </section>
      ) : null}
      {isPending ? (
        <div className="flex flex-1 items-center justify-center" role="status">
          <span className="sr-only">레시피를 불러오는 중입니다.</span>
        </div>
      ) : hasRecipes ? (
        <section
          aria-label={`${pageTitle} 목록`}
          className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pt-2 pb-8"
        >
          {isRecommendations
            ? visibleRecommendationItems.map((item) => (
                <RecipeCard
                  key={`${recommendationData?.requestId ?? recommendationData?.source}-${item.rank}-${item.recipe.recipeId}`}
                  recipe={toRecipe(item.recipe)}
                  recommendationContext={{
                    requestId: recommendationData?.requestId,
                    position: item.rank,
                  }}
                  variant="search"
                />
              ))
            : recipes.map((recipe) => (
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
          <p className="text-sm text-[var(--primitive-grey-500)]">
            {isRecommendations ? '추천할 레시피가 없어요.' : '등록된 레시피가 없어요.'}
          </p>
        </section>
      )}
      <BottomNavigation />
    </main>
  );
}
