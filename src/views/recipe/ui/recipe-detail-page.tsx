'use client';

import { Bookmark, Check, Share } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useCartItemCount } from '@/entities/cart/model/use-cart-item-count';
import { CartCountBadge } from '@/shared/ui/cart-count-badge';
import { RecipeCartActions } from '@/features/recipe-cart/ui/recipe-cart-actions';
import { useRecipeMutations } from '@/entities/recipe/api/use-recipe-mutations';
import { useRecipeDetailQuery } from '@/entities/recipe/api/use-recipe-detail-query';
import type { RecipeRecommendationContext } from '@/entities/recipe/api/recipe.dto';
import { useRecipePantryMatchQuery } from '@/entities/recipe/api/use-recipe-pantry-match-query';
import { useRecipeProductMatchQuery } from '@/entities/recipe/api/use-recipe-product-match-query';
import { useScrappedRecipesQuery } from '@/entities/recipe/api/use-scrapped-recipes-query';
import type { RecipeDetail } from '@/entities/recipe/model/types';
import { CART_HREF } from '@/shared/config/cart-write-mode';
import { SystemErrorState } from '@/shared/ui/system-error-state';
import {
  getPantryCleanupSuccessMessage,
  PantryCleanupBottomSheet,
} from './pantry-cleanup-bottom-sheet';

interface RecipeDetailPageProps {
  recipeId: string;
  recommendationContext?: RecipeRecommendationContext;
}

const difficultyLabels = {
  EASY: '쉬움',
  NORMAL: '보통',
  HARD: '어려움',
} as const;

export const COOKING_GUIDE_DELAY_MS = 60 * 1000;
export const COOKING_GUIDE_VISIBLE_MS = 10 * 1000;

export function toggleIngredientSelection(selectedIds: string[], ingredientId: string) {
  return selectedIds.includes(ingredientId)
    ? selectedIds.filter((id) => id !== ingredientId)
    : [...selectedIds, ingredientId];
}

export function areAllIngredientsSelected(selectedIds: string[], ingredientIds: string[]) {
  return ingredientIds.length > 0 && ingredientIds.every((id) => selectedIds.includes(id));
}

export function getCookingCompletionVariables(
  recipeId: string,
  shouldCleanup: boolean,
  pantryItemIds: number[],
  recommendationContext?: RecipeRecommendationContext,
) {
  return {
    recipeId,
    ...(shouldCleanup && pantryItemIds.length > 0 ? { pantryItemIds } : {}),
    ...(recommendationContext?.requestId && recommendationContext.position != null
      ? {
          requestId: recommendationContext.requestId,
          position: recommendationContext.position,
        }
      : {}),
  };
}

export function RecipeDetailPage({ recipeId, recommendationContext }: RecipeDetailPageProps) {
  const {
    data: recipe,
    error,
    isPending,
    refetch,
  } = useRecipeDetailQuery(recipeId, recommendationContext);

  if (isPending) {
    return (
      <main className="mobile-page bg-background min-h-dvh" role="status">
        <span className="sr-only">레시피 상세를 불러오는 중입니다.</span>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="mobile-page bg-background flex min-h-dvh flex-col">
        <SystemErrorState onRetry={() => void refetch()} title="레시피를 불러오지 못했어요" />
      </main>
    );
  }

  return <RecipeDetailContent recipe={recipe} recommendationContext={recommendationContext} />;
}

function RecipeDetailContent({
  recipe,
  recommendationContext,
}: {
  recipe: RecipeDetail;
  recommendationContext?: RecipeRecommendationContext;
}) {
  const { completeCooking, scrap, unscrap } = useRecipeMutations();
  const pantryMatchQuery = useRecipePantryMatchQuery(recipe.id);
  const productMatchQuery = useRecipeProductMatchQuery(recipe.id);
  const scrappedRecipesQuery = useScrappedRecipesQuery();
  const cartItemCount = useCartItemCount();
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [completionErrorMessage, setCompletionErrorMessage] = useState<string | null>(null);
  const [isPantryCleanupOpen, setIsPantryCleanupOpen] = useState(false);
  const [selectedPantryItemIds, setSelectedPantryItemIds] = useState<number[]>([]);
  const [scrapMessage, setScrapMessage] = useState<string | null>(null);
  const [isCookingGuideVisible, setIsCookingGuideVisible] = useState(false);
  const stepsSectionRef = useRef<HTMLElement>(null);
  const hasStartedCookingGuideTimerRef = useRef(false);
  const hasSelectedIngredient = selectedIngredientIds.length > 0;
  const isScrapped =
    scrappedRecipesQuery.data?.some((scrapped) => scrapped.id === recipe.id) ?? false;
  const isScrapPending =
    scrappedRecipesQuery.isPending ||
    scrappedRecipesQuery.isError ||
    scrap.isPending ||
    unscrap.isPending;
  const ingredients = recipe.ingredients;
  const steps = recipe.steps;

  useEffect(() => {
    if (!completionMessage) return;

    const timeoutId = window.setTimeout(() => setCompletionMessage(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [completionMessage]);

  useEffect(() => {
    const stepsSection = stepsSectionRef.current;
    if (!stepsSection) return;

    let hideTimer: number | undefined;
    let showTimer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedCookingGuideTimerRef.current) return;

        hasStartedCookingGuideTimerRef.current = true;
        showTimer = window.setTimeout(() => {
          setIsCookingGuideVisible(true);
          hideTimer = window.setTimeout(() => {
            setIsCookingGuideVisible(false);
          }, COOKING_GUIDE_VISIBLE_MS);
        }, COOKING_GUIDE_DELAY_MS);
        observer.disconnect();
      },
      { threshold: 0.01 },
    );

    observer.observe(stepsSection);

    return () => {
      observer.disconnect();
      if (showTimer !== undefined) window.clearTimeout(showTimer);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, []);

  const handleIngredientClick = (ingredientId: string) => {
    setSelectedIngredientIds((selectedIds) => toggleIngredientSelection(selectedIds, ingredientId));
  };

  const matchedPantryItems =
    pantryMatchQuery.data?.ingredients.flatMap((ingredient) =>
      ingredient.matchedPantryItems.map((item) => ({
        pantryItemId: item.pantryItemId,
        name: ingredient.name,
        imageUrl: ingredients.find(
          (recipeIngredient) => recipeIngredient.id === String(ingredient.ingredientId),
        )?.imageUrl,
      })),
    ) ?? [];
  const uniqueMatchedPantryItems = matchedPantryItems.filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.pantryItemId === item.pantryItemId) === index,
  );

  const closePantryCleanupSheet = () => {
    setIsPantryCleanupOpen(false);
    setSelectedPantryItemIds([]);
    setCompletionErrorMessage(null);
  };

  const submitCookingComplete = async (shouldCleanup: boolean) => {
    const pantryItemIds = shouldCleanup ? selectedPantryItemIds : [];
    setCompletionErrorMessage(null);

    try {
      await completeCooking.mutateAsync(
        getCookingCompletionVariables(
          recipe.id,
          shouldCleanup,
          pantryItemIds,
          recommendationContext,
        ),
      );
      closePantryCleanupSheet();
      setCompletionMessage(
        shouldCleanup ? getPantryCleanupSuccessMessage(pantryItemIds.length) : null,
      );
    } catch {
      setCompletionErrorMessage('조리 완료를 저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  const handleCookingComplete = () => {
    setSelectedPantryItemIds([]);
    setCompletionErrorMessage(null);
    setIsPantryCleanupOpen(true);
  };

  const togglePantryItem = (id: number) => {
    setSelectedPantryItemIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  const handleScrap = async () => {
    setScrapMessage(null);
    try {
      const action =
        recommendationContext?.requestId && recommendationContext.position != null
          ? {
              recipeId: recipe.id,
              requestId: recommendationContext.requestId,
              position: recommendationContext.position,
            }
          : recipe.id;
      await (isScrapped ? unscrap.mutateAsync(action) : scrap.mutateAsync(action));
    } catch {
      setScrapMessage('스크랩을 변경하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <main
      className="mobile-page bg-[var(--background-primary)] pb-10 text-[var(--text-primary)]"
      data-recipe-id={recipe.id}
    >
      <section className="relative h-[219px] overflow-hidden">
        {recipe.thumbnailUrl ? (
          <Image
            alt={recipe.name}
            className="object-cover object-[center_60%]"
            fill
            priority
            sizes="(max-width: 390px) 100vw, 390px"
            src={recipe.thumbnailUrl}
            unoptimized
          />
        ) : null}
      </section>

      <div className="mobile-page--padded">
        <section className="relative py-4">
          <h1 className="text-title-2 pr-24 font-semibold">{recipe.name}</h1>
          <p className="text-body-4 mt-1 font-medium text-[var(--primitive-grey-600)]">
            {recipe.category} · {recipe.cookTime} · {recipe.servings}인분 ·{' '}
            {difficultyLabels[recipe.difficulty]}
          </p>
          <div className="absolute top-2 right-0 flex items-center gap-0.5">
            <button
              aria-label="레시피 공유"
              className="grid size-10 place-items-center text-[var(--primitive-grey-700)]"
              type="button"
            >
              <Share size={24} strokeWidth={1.5} />
            </button>
            <button
              aria-label={`레시피 ${isScrapped ? '스크랩 해제' : '스크랩'}`}
              aria-pressed={isScrapped}
              className="grid size-10 place-items-center text-[var(--primitive-grey-700)]"
              disabled={isScrapPending}
              onClick={() => void handleScrap()}
              type="button"
            >
              <Bookmark
                fill={isScrapped ? 'var(--primitive-primary-700)' : 'none'}
                size={24}
                stroke={isScrapped ? 'none' : 'currentColor'}
                strokeWidth={isScrapped ? 0 : 1.5}
              />
            </button>
          </div>
        </section>

        {scrappedRecipesQuery.isError ? (
          <p className="text-body-4 text-destructive pb-2" role="status">
            스크랩 상태를 확인하지 못했어요.
          </p>
        ) : null}
        {scrapMessage ? (
          <p className="text-body-4 text-destructive pb-2" role="status">
            {scrapMessage}
          </p>
        ) : null}

        {recipe.description ? (
          <p className="text-body-4 border-t border-[var(--border-subtle)] py-4 font-normal text-[var(--text-secondary)]">
            {recipe.description}
          </p>
        ) : null}

        <section
          className="border-t border-[var(--border-subtle)] py-4"
          aria-labelledby="ingredients-heading"
        >
          <h2 className="text-title-4 font-semibold" id="ingredients-heading">
            필요 재료
          </h2>
          <ul className="mt-4 grid grid-cols-3 justify-items-center gap-2">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <button
                  aria-label={`${ingredient.name} 선택`}
                  aria-pressed={selectedIngredientIds.includes(ingredient.id)}
                  className="relative flex h-44 w-28 flex-col items-center justify-center rounded-xl border-[1px] bg-[var(--surface-default)] px-3 text-left transition-[border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.98]"
                  onClick={() => handleIngredientClick(ingredient.id)}
                  style={{
                    borderColor: selectedIngredientIds.includes(ingredient.id)
                      ? 'var(--primitive-primary-500)'
                      : 'var(--primitive-grey-300)',
                  }}
                  type="button"
                >
                  <div className="relative flex flex-col items-center gap-1 self-stretch">
                    {hasSelectedIngredient ? (
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 -right-[12.5px] z-10 grid size-10 place-items-center"
                      >
                        <span
                          className={`grid size-6 place-items-center rounded-full transition-colors duration-200 ${
                            selectedIngredientIds.includes(ingredient.id)
                              ? 'bg-[var(--primitive-primary-400)] text-[var(--primitive-grey-800)]'
                              : 'bg-[var(--primitive-grey-100)] text-[var(--primitive-grey-400)]'
                          }`}
                        >
                          <Check size={18} strokeWidth={2} />
                        </span>
                      </span>
                    ) : null}
                    <div className="relative size-20 overflow-hidden rounded-lg bg-[var(--surface-secondary)]">
                      {ingredient.imageUrl ? (
                        <Image
                          alt=""
                          className="object-cover"
                          fill
                          sizes="80px"
                          src={ingredient.imageUrl}
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <p className="text-label-3 w-20 truncate text-center font-medium">
                      {ingredient.name}
                    </p>
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-label-4 truncate font-medium text-[var(--primitive-grey-600)]">
                        {ingredient.amount}
                      </p>
                      {ingredient.isMain ? (
                        <span className="text-label-4 rounded-full bg-[var(--primitive-secondary-100)] px-2 text-[var(--primitive-secondary-800)]">
                          주재료
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <RecipeCartActions
            productMatches={productMatchQuery.data?.ingredients ?? []}
            isProductMatchPending={productMatchQuery.isPending}
            isProductMatchError={productMatchQuery.isError}
            onRetryProductMatch={() => void productMatchQuery.refetch()}
            returnTo={`/recipe/${recipe.id}`}
            selectedIngredientIds={selectedIngredientIds}
          />
        </section>

        <section
          className="border-t border-[var(--border-subtle)] py-4"
          aria-labelledby="steps-heading"
          ref={stepsSectionRef}
        >
          <h2 className="text-title-4 font-semibold" id="steps-heading">
            조리 순서
          </h2>
          <ol className="mt-4 space-y-8">
            {steps.map((step) => (
              <li key={step.number}>
                <p className="text-label-3 font-semibold text-[var(--primitive-primary-700)]">
                  STEP {step.number}
                </p>
                <p className="text-body-4 mt-2 leading-6 font-medium text-[var(--primitive-black)]">
                  {step.description}
                </p>
                {step.imageUrl ? (
                  <Image
                    alt={`${recipe.name} ${step.number}단계 이미지`}
                    className="mt-3 h-auto w-full rounded-xl object-cover"
                    height={320}
                    src={step.imageUrl}
                    unoptimized
                    width={358}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <button
          className="text-title-4 h-12 w-full rounded-xl bg-[var(--primitive-primary-500)] font-semibold text-[var(--primitive-grey-800)]"
          onClick={() => void handleCookingComplete()}
          disabled={completeCooking.isPending || pantryMatchQuery.isPending}
          type="button"
        >
          조리 완료
        </button>
      </div>
      <Link
        aria-label={`장바구니 ${cartItemCount}개 상품`}
        className="fixed bottom-8 left-1/2 z-40 ml-[130px] grid size-10 place-items-center rounded-full bg-[var(--primitive-primary-500)] shadow-[var(--shadow-floating)]"
        href={CART_HREF}
      >
        <Image
          alt=""
          aria-hidden="true"
          height={24}
          src="/images/recipe/shopping-cart-icon.svg"
          width={24}
        />
        <CartCountBadge count={cartItemCount} />
      </Link>
      {isCookingGuideVisible ? (
        <p
          aria-live="polite"
          className="fixed top-4 left-1/2 z-50 inline-flex h-9 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--primitive-grey-800)] px-5 text-xs leading-5 whitespace-nowrap text-[var(--primitive-white)] shadow-[var(--shadow-floating)]"
          role="status"
        >
          <span className="text-xs leading-5 font-medium">요리 완성 후 하단의 </span>
          <strong className="text-xs leading-5 font-bold">조리 완료</strong>
          <span className="text-xs leading-5 font-medium">를 눌러 주세요.</span>
        </p>
      ) : null}
      {completionMessage ? (
        <p
          aria-live="polite"
          className="fixed bottom-25 left-1/2 z-[70] inline-flex h-9 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--primitive-grey-800)] px-5 text-sm leading-5 font-medium whitespace-nowrap text-[var(--primitive-white)] shadow-[var(--shadow-floating)]"
          role="status"
        >
          {completionMessage}
        </p>
      ) : null}
      {isPantryCleanupOpen ? (
        <PantryCleanupBottomSheet
          errorMessage={completionErrorMessage}
          isSubmitting={completeCooking.isPending}
          items={uniqueMatchedPantryItems}
          onCleanup={() => void submitCookingComplete(true)}
          onDefer={() => void submitCookingComplete(false)}
          onToggle={togglePantryItem}
          selectedItemIds={selectedPantryItemIds}
        />
      ) : null}
    </main>
  );
}
