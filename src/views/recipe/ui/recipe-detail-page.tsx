'use client';

import { Bookmark, Check, Share } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useCartItemCount } from '@/entities/cart/model/use-cart-item-count';
import { CartCountBadge } from '@/shared/ui/cart-count-badge';
import { RecipeCartActions } from '@/features/recipe-cart/ui/recipe-cart-actions';
import { useRecipeMutations } from '@/entities/recipe/api/use-recipe-mutations';
import { useRecipeDetailQuery } from '@/entities/recipe/api/use-recipe-detail-query';
import type {
  RecipePantryMatchDto,
  RecipeRecommendationContext,
} from '@/entities/recipe/api/recipe.dto';
import { useRecipePantryMatchQuery } from '@/entities/recipe/api/use-recipe-pantry-match-query';
import { useRecipeProductMatchQuery } from '@/entities/recipe/api/use-recipe-product-match-query';
import { useScrappedRecipesQuery } from '@/entities/recipe/api/use-scrapped-recipes-query';
import type { RecipeDetail } from '@/entities/recipe/model/types';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
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
const RECIPE_INGREDIENTS_PER_PAGE = 6;

function chunkIngredients<T>(items: T[], chunkSize: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / chunkSize) }, (_, index) =>
    items.slice(index * chunkSize, (index + 1) * chunkSize),
  );
}

function getLocalDate(date: string): Date | null {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return null;

  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getPantryIngredientStatus(
  ingredientId: string,
  pantryMatch: RecipePantryMatchDto | undefined,
  isPending: boolean,
  isError: boolean,
  today = new Date(),
) {
  if (isPending) return { label: '확인 중', className: 'bg-muted text-muted-foreground' };
  if (isError) return { label: '확인 실패', className: 'bg-muted text-muted-foreground' };

  const matchedIngredient = pantryMatch?.ingredients.find(
    (ingredient) => String(ingredient.ingredientId) === ingredientId,
  );
  if (!matchedIngredient?.hasIngredient) {
    return { label: '미보유', className: 'bg-destructive/10 text-destructive' };
  }

  const matchedItems = matchedIngredient.matchedPantryItems;
  if (matchedItems.length === 0) {
    return {
      label: '보유 · 소비기한 미등록',
      className: 'bg-muted text-muted-foreground',
    };
  }

  const datedItems = matchedItems.flatMap((item) => {
    const expiryDate = getLocalDate(item.expiryDate);
    return expiryDate ? [{ item, expiryDate }] : [];
  });
  const unexpiredItems = datedItems.filter(({ item }) => item.expiryStatus !== 'EXPIRED');
  const candidates = unexpiredItems.length > 0 ? unexpiredItems : datedItems;
  const nearestItem = candidates.sort((left, right) =>
    unexpiredItems.length > 0
      ? left.expiryDate.getTime() - right.expiryDate.getTime()
      : right.expiryDate.getTime() - left.expiryDate.getTime(),
  )[0];

  if (!nearestItem) {
    return {
      label: '보유 · 소비기한 미등록',
      className: 'bg-muted text-muted-foreground',
    };
  }

  if (nearestItem.item.expiryStatus === 'EXPIRED') {
    return { label: '보유 · 소비기한 지남', className: 'bg-destructive/10 text-destructive' };
  }

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysLeft = Math.ceil(
    (nearestItem.expiryDate.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (daysLeft < 0) {
    return { label: '보유 · 소비기한 지남', className: 'bg-destructive/10 text-destructive' };
  }

  return {
    label: `보유 · D-${daysLeft}`,
    className:
      nearestItem.item.expiryStatus === 'IMMINENT' || daysLeft <= 3
        ? 'bg-[var(--primitive-warning-100)] text-[var(--primitive-warning-500)]'
        : 'bg-muted text-muted-foreground',
  };
}

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

export function getCookingCompletionLoginHref(
  authState: 'loading' | 'guest' | 'complete' | 'onboarding',
  recipeId: string,
) {
  return authState === 'guest'
    ? `/login?returnTo=${encodeURIComponent(`/recipe/${recipeId}`)}`
    : null;
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

  return (
    <RecipeDetailContent
      key={recipe.id}
      recipe={recipe}
      recommendationContext={recommendationContext}
    />
  );
}

function RecipeDetailContent({
  recipe,
  recommendationContext,
}: {
  recipe: RecipeDetail;
  recommendationContext?: RecipeRecommendationContext;
}) {
  const router = useRouter();
  const { restore, state: authState } = useAuthSession();
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
  const ingredientCarouselRef = useRef<HTMLDivElement>(null);
  const [activeIngredientPage, setActiveIngredientPage] = useState(0);
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
  const ingredientPages = chunkIngredients(ingredients, RECIPE_INGREDIENTS_PER_PAGE);
  const steps = recipe.steps;

  const goToIngredientPage = (pageIndex: number) => {
    const carousel = ingredientCarouselRef.current;
    if (!carousel) return;

    carousel.scrollTo({ left: pageIndex * carousel.clientWidth, behavior: 'smooth' });
    setActiveIngredientPage(pageIndex);
  };

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

  const handleCookingComplete = async () => {
    const resolvedAuthState = authState === 'loading' ? await restore() : authState;
    const loginHref = getCookingCompletionLoginHref(resolvedAuthState, recipe.id);

    if (loginHref) {
      router.push(loginHref);
      return;
    }

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
          <div
            aria-label="필요 재료 목록"
            className={`mt-4 flex ${
              ingredientPages.length > 1
                ? 'snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden'
                : 'overflow-x-hidden'
            }`}
            onScroll={(event) => {
              const { scrollLeft, clientWidth } = event.currentTarget;
              if (clientWidth > 0) {
                setActiveIngredientPage(Math.round(scrollLeft / clientWidth));
              }
            }}
            ref={ingredientCarouselRef}
            role="region"
            tabIndex={ingredientPages.length > 1 ? 0 : undefined}
          >
            {ingredientPages.map((page, pageIndex) => (
              <ul
                aria-label={`필요 재료 ${pageIndex + 1}페이지`}
                className={`grid w-full shrink-0 grid-cols-3 justify-items-center gap-2 ${ingredientPages.length > 1 ? 'snap-start' : ''}`}
                key={pageIndex}
              >
                {page.map((ingredient) => {
                  const pantryStatus = getPantryIngredientStatus(
                    ingredient.id,
                    pantryMatchQuery.data,
                    pantryMatchQuery.isPending,
                    pantryMatchQuery.isError,
                  );

                  return (
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
                            <span
                              className={`text-label-4 max-w-full truncate rounded-full px-2 ${pantryStatus.className}`}
                            >
                              {pantryStatus.label}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
          {ingredientPages.length > 1 ? (
            <div aria-label="필요 재료 페이지" className="mt-4 flex justify-center gap-2">
              {ingredientPages.map((_, pageIndex) => (
                <button
                  aria-label={`재료 ${pageIndex + 1}페이지로 이동`}
                  aria-pressed={activeIngredientPage === pageIndex}
                  className={`h-3 rounded-full transition-[width,background-color] ${
                    activeIngredientPage === pageIndex
                      ? 'w-8 bg-[var(--primitive-primary-400)]'
                      : 'w-3 bg-[var(--primitive-grey-200)]'
                  }`}
                  key={pageIndex}
                  onClick={() => goToIngredientPage(pageIndex)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
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
          height={16}
          src="/images/recipe/shopping-cart-icon.svg"
          width={16}
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
