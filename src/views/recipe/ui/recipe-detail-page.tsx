'use client';

import { Bookmark, Check, Share } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getCartItemCount, useCartStore } from '@/entities/cart/model/cart-store';
import { useRecipeMutations } from '@/entities/recipe/api/use-recipe-mutations';
import { useRecipeDetailQuery } from '@/entities/recipe/api/use-recipe-detail-query';
import { useRecipePantryMatchQuery } from '@/entities/recipe/api/use-recipe-pantry-match-query';
import { useScrappedRecipesQuery } from '@/entities/recipe/api/use-scrapped-recipes-query';
import type { RecipeDetail } from '@/entities/recipe/model/types';
import { SystemErrorState } from '@/shared/ui/system-error-state';

interface RecipeDetailPageProps {
  recipeId: string;
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

export function RecipeDetailPage({ recipeId }: RecipeDetailPageProps) {
  const { data: recipe, error, isPending, refetch } = useRecipeDetailQuery(recipeId);

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

  return <RecipeDetailContent recipe={recipe} />;
}

function RecipeDetailContent({ recipe }: { recipe: RecipeDetail }) {
  const { completeCooking, scrap, unscrap } = useRecipeMutations();
  const pantryMatchQuery = useRecipePantryMatchQuery(recipe.id);
  const scrappedRecipesQuery = useScrappedRecipesQuery();
  const cartItems = useCartStore((state) => state.items);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isPantryCleanupOpen, setIsPantryCleanupOpen] = useState(false);
  const [selectedPantryItemIds, setSelectedPantryItemIds] = useState<number[]>([]);
  const [scrapMessage, setScrapMessage] = useState<string | null>(null);
  const [isCookingGuideVisible, setIsCookingGuideVisible] = useState(false);
  const stepsSectionRef = useRef<HTMLElement>(null);
  const hasStartedCookingGuideTimerRef = useRef(false);
  const hasSelectedIngredient = selectedIngredientIds.length > 0;
  const cartItemCount = getCartItemCount(cartItems);
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
        ...item,
        ingredientName: ingredient.name,
      })),
    ) ?? [];
  const uniqueMatchedPantryItems = matchedPantryItems.filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.pantryItemId === item.pantryItemId) === index,
  );

  const submitCookingComplete = async (pantryItemIds?: number[]) => {
    try {
      await completeCooking.mutateAsync({ recipeId: recipe.id, pantryItemIds });
      setIsPantryCleanupOpen(false);
      setCompletionMessage('조리 완료를 기록했어요.');
    } catch {
      setCompletionMessage('조리 완료를 저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  const handleCookingComplete = () => {
    if (uniqueMatchedPantryItems.length > 0) {
      setIsPantryCleanupOpen(true);
      return;
    }
    void submitCookingComplete();
  };

  const togglePantryItem = (id: number) => {
    setSelectedPantryItemIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  const handleScrap = async () => {
    setScrapMessage(null);
    try {
      await (isScrapped ? unscrap.mutateAsync(recipe.id) : scrap.mutateAsync(recipe.id));
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
          <div className="mt-4 flex gap-2">
            <button
              className="text-label-3 h-10 flex-1 rounded-full border-[1.5px] border-[var(--primitive-primary-400)] bg-[var(--surface-default)] font-medium text-[var(--primitive-black)]"
              disabled
              type="button"
            >
              선택 담기
            </button>
            <button
              className="text-label-3 h-10 flex-1 rounded-full border-[1.5px] border-[var(--primitive-primary-500)] bg-[var(--primitive-primary-300)] font-medium text-[var(--primitive-black)]"
              disabled
              style={{ borderColor: 'var(--primitive-primary-500)' }}
              type="button"
            >
              부족한 재료 담기
            </button>
          </div>
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
        href="/cart"
      >
        <Image
          alt=""
          aria-hidden="true"
          height={24}
          src="/images/recipe-detail/shoppingcart.svg"
          width={24}
        />
        {cartItemCount > 0 ? (
          <span className="text-caption absolute top-0 -right-1 grid size-[14px] place-items-center rounded-full bg-[var(--primitive-grey-800)] font-medium text-[var(--primitive-white)]">
            {cartItemCount}
          </span>
        ) : null}
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
        <div className="fixed inset-0 z-[80] flex items-end bg-black/40" role="presentation">
          <section
            aria-labelledby="pantry-cleanup-title"
            aria-modal="true"
            className="bg-background mobile-page rounded-t-2xl px-5 pt-6 pb-8"
            role="dialog"
          >
            <h2 className="text-title-3 font-semibold" id="pantry-cleanup-title">
              사용한 재료를 정리할까요?
            </h2>
            <p className="mt-2 text-sm text-[var(--primitive-grey-500)]">
              조리에 사용한 팬트리 재료를 선택해 주세요.
            </p>
            <ul className="mt-4 max-h-[40dvh] space-y-2 overflow-y-auto">
              {uniqueMatchedPantryItems.map((item) => (
                <li key={item.pantryItemId}>
                  <label className="flex items-center gap-3 rounded-lg border border-[var(--primitive-grey-200)] p-3">
                    <input
                      checked={selectedPantryItemIds.includes(item.pantryItemId)}
                      onChange={() => togglePantryItem(item.pantryItemId)}
                      type="checkbox"
                    />
                    <span className="flex-1">{item.ingredientName}</span>
                    <span className="text-xs text-[var(--primitive-grey-500)]">
                      {item.expiryStatus === 'IMMINENT'
                        ? '소비기한 임박'
                        : item.expiryStatus === 'EXPIRED'
                          ? '소비기한 경과'
                          : '소비기한 여유'}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <button
                className="h-12 flex-1 rounded-xl border border-[var(--primitive-grey-300)]"
                disabled={completeCooking.isPending}
                onClick={() => void submitCookingComplete()}
                type="button"
              >
                나중에
              </button>
              <button
                className="h-12 flex-1 rounded-xl bg-[var(--primitive-primary-500)] font-semibold"
                disabled={!selectedPantryItemIds.length || completeCooking.isPending}
                onClick={() => void submitCookingComplete(selectedPantryItemIds)}
                type="button"
              >
                정리하기
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
