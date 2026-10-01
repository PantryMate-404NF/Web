'use client';

import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { useCartItemCount } from '@/entities/cart/model/use-cart-item-count';
import { CartCountBadge } from '@/shared/ui/cart-count-badge';
import { toRecipe } from '@/entities/recipe/api/recipe.mapper';
import { useRecipeSearchQuery } from '@/entities/recipe/api/use-recipe-search-query';
import { useRecipeFilterIngredientsQuery } from '@/entities/recipe/api/use-recipe-filter-ingredients-query';
import { useRecipeMutations } from '@/entities/recipe/api/use-recipe-mutations';
import { useRecipeRecommendationsQuery } from '@/entities/recipe/api/use-recipe-recommendations-query';
import type {
  RecipeFilterIngredientDto,
  RecipeRecommendationContext,
  RecipeRecommendationItemDto,
  RecipeRecommendationsDto,
  RecipeRecommendationSource,
} from '@/entities/recipe/api/recipe.dto';
import { useScrappedRecipesQuery } from '@/entities/recipe/api/use-scrapped-recipes-query';
import { usePantriesQuery } from '@/entities/pantry/api/use-pantries-query';
import { useRecipePantrySelectionStore } from '@/entities/pantry/model/recipe-pantry-selection-store';
import type { PantryItem } from '@/entities/pantry/model/types';
import type { Recipe } from '@/entities/recipe/model/types';
import { ApiError } from '@/shared/api/api-error';
import { CART_HREF } from '@/shared/config/cart-write-mode';
import { SystemErrorState } from '@/shared/ui/system-error-state';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import type { AuthSessionState } from '@/features/auth/model/auth-session';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

export type RecipeSectionId = 'all' | 'personalized' | 'recommendations';
export type RecipeRecommendationVariant = 'pantry' | 'personalized';

export interface RecipeRailSection {
  id: RecipeSectionId;
  title: string;
  description: string;
  recipes: Recipe[];
}

export interface ImminentIngredient {
  name: string;
  daysLeft: number | null;
}

export type RecipeDisplayMode = 'pantry' | 'basic';
export type RecipeContentMode = 'search' | 'list';
export const RECIPE_ACTION_LAYOUT = {
  containerClassName: 'flex h-[60px] shrink-0 items-center pb-5',
  sectionHeaderClassName: '-mr-4 flex h-[60px] items-center justify-between',
  textClassName: 'text-base -mr-1.5 font-medium text-[var(--primitive-grey-600)]',
  titleBlockClassName: 'flex h-12 min-w-0 flex-col',
  topActionClassName: 'flex shrink-0 items-center',
  topHeaderClassName: 'flex h-10 items-center justify-between pl-4',
  topPanelClassName: 'mt-2 px-4',
} as const;

export const RECIPE_RAIL_TYPOGRAPHY = {
  descriptionClassName:
    'truncate text-[15px] leading-[1.5] font-medium text-[var(--primitive-grey-500)]',
  titleClassName: 'text-title-3 font-semibold',
} as const;
export const RECIPE_PANTRY_DIVIDER_CLASS = 'h-2 w-full bg-[var(--primitive-grey-100)]';

export const RECIPE_SEARCH_EMPTY_COPY = {
  title: '검색 결과가 없어요.',
  descriptionLines: ['다른 검색어를 입력하거나', '맞춤법을 확인해보세요'],
} as const;

export function getIngredientSelectionRoute(): string {
  return '/pantry';
}

export function getRecipeMoreRoute(
  sectionId: RecipeSectionId,
  ingredientIds: number[] = [],
  title?: string,
): string {
  const params = new URLSearchParams({ section: sectionId });
  if (title) params.set('title', title);
  ingredientIds.forEach((id) => params.append('ingredientIds', String(id)));
  return `/recipe/more?${params.toString()}`;
}

export function filterRecipesByQuery(recipes: Recipe[], query: string): Recipe[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) return recipes;

  return recipes.filter((recipe) => recipe.name.toLocaleLowerCase().includes(normalizedQuery));
}

export function getRecipeContentMode(query: string): RecipeContentMode {
  return query.trim() ? 'search' : 'list';
}

export function shouldEnableRecipeRecommendations(
  authState: AuthSessionState,
  contentMode: RecipeContentMode,
  variant: RecipeRecommendationVariant,
): boolean {
  if (contentMode !== 'list') return false;

  return variant === 'personalized'
    ? authState === 'complete'
    : authState === 'complete' || authState === 'onboarding';
}

export function getRecipeViewState(error: unknown): 'content' | 'error' {
  return error ? 'error' : 'content';
}

export function getPantryRecipeMatchError(
  selectedRecipesError: unknown,
  ingredientLookupError: unknown,
) {
  return selectedRecipesError ?? ingredientLookupError ?? null;
}

export function getRecipeSearchResultDisplay(recipes: Recipe[]): 'results' | 'empty' {
  return recipes.length === 0 ? 'empty' : 'results';
}

export function getRecipeSearchPagination(page: number, totalPages: number) {
  return {
    currentPage: page + 1,
    totalPages,
    canGoPrevious: page > 0,
    canGoNext: page + 1 < totalPages,
  };
}

export function getRecipeSearchPageNumbers(page: number, totalPages: number) {
  const firstPage = Math.floor(page / 5) * 5;
  const visiblePageCount = Math.max(0, Math.min(5, totalPages - firstPage));

  return Array.from({ length: visiblePageCount }, (_, index) => firstPage + index + 1);
}

export function RecipeSearchPagination({
  page,
  totalPages,
  onPageChange,
  ariaLabel = '레시피 검색 페이지',
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}) {
  const pagination = getRecipeSearchPagination(page, totalPages);
  const pageNumbers = getRecipeSearchPageNumbers(page, totalPages);

  return (
    <nav aria-label={ariaLabel} className="flex items-center justify-center gap-1 py-4">
      <button
        aria-label="이전 페이지"
        className="grid size-8 place-items-center rounded-lg p-1.5 text-[var(--primitive-grey-600)] disabled:text-[var(--primitive-grey-400)]"
        disabled={!pagination.canGoPrevious}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </button>
      <div className="flex items-center gap-0.5" aria-live="polite">
        {pageNumbers.map((pageNumber) => {
          const isCurrentPage = pageNumber === pagination.currentPage;

          return (
            <button
              aria-current={isCurrentPage ? 'page' : undefined}
              aria-label={`${pageNumber}페이지`}
              className={`grid size-8 place-items-center rounded-lg text-base leading-6 font-medium ${
                isCurrentPage
                  ? 'bg-[var(--primitive-primary-300)] text-[var(--primitive-primary-800)]'
                  : 'text-[var(--primitive-grey-600)]'
              }`}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber - 1)}
              type="button"
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button
        aria-label="다음 페이지"
        className="grid size-8 place-items-center rounded-lg p-1.5 text-[var(--primitive-grey-600)] disabled:text-[var(--primitive-grey-400)]"
        disabled={!pagination.canGoNext}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </button>
    </nav>
  );
}

export function getRecipeDisplayMode(items: PantryItem[]): RecipeDisplayMode {
  return items.length > 0 ? 'pantry' : 'basic';
}

export function getImminentIngredients(items: PantryItem[]): ImminentIngredient[] {
  return items
    .filter(
      (item) =>
        item.availability === 'AVAILABLE' &&
        item.expirationStatus === 'IMMINENT' &&
        item.daysUntilExpiration !== null,
    )
    .sort((left, right) => left.daysUntilExpiration! - right.daysUntilExpiration!)
    .slice(0, 3)
    .map((item) => ({ name: item.name, daysLeft: item.daysUntilExpiration! }));
}

export function getImminentPantryItemIds(items: PantryItem[]): string[] {
  return items
    .filter(
      (item) =>
        item.availability === 'AVAILABLE' &&
        item.expirationStatus === 'IMMINENT' &&
        item.daysUntilExpiration !== null,
    )
    .sort((left, right) => left.daysUntilExpiration! - right.daysUntilExpiration!)
    .slice(0, 3)
    .map((item) => item.id);
}

export function getRecipePantryItemIds(items: PantryItem[]): string[] {
  const imminentItemIds = getImminentPantryItemIds(items);
  if (imminentItemIds.length > 0) return imminentItemIds;

  return items
    .filter((item) => item.availability === 'AVAILABLE' && item.expirationStatus !== 'EXPIRED')
    .slice(0, 3)
    .map((item) => item.id);
}

export function getAvailablePantryIngredients(
  items: PantryItem[],
  selectedIngredientIds?: number[],
  recipeIngredients: RecipeFilterIngredientDto[] = [],
  selectedPantryItemIds: string[] = [],
): ImminentIngredient[] {
  if (selectedPantryItemIds.length > 0) {
    return selectedPantryItemIds.flatMap((pantryItemId) => {
      const pantryItem = items.find((item) => item.id === pantryItemId);
      return pantryItem
        ? [{ name: pantryItem.name, daysLeft: pantryItem.daysUntilExpiration }]
        : [];
    });
  }

  if (selectedIngredientIds) {
    return selectedIngredientIds.slice(0, 3).flatMap((ingredientId) => {
      const ingredient = recipeIngredients.find(
        (candidate) => candidate.ingredientId === ingredientId,
      );
      const pantryItem =
        items.find((item) => item.ingredientId === ingredientId) ??
        items.find((item) => item.name.trim() === ingredient?.name.trim());
      const name = ingredient?.name ?? pantryItem?.name;

      if (!name) return [];

      return [
        {
          name,
          daysLeft: pantryItem?.daysUntilExpiration ?? null,
        },
      ];
    });
  }

  return items
    .filter((item) => item.availability === 'AVAILABLE' && item.daysUntilExpiration !== null)
    .slice(0, 3)
    .map((item) => ({ name: item.name, daysLeft: item.daysUntilExpiration }));
}

export function getSelectedRecipeIngredientIds(
  items: PantryItem[],
  selectedPantryItemIds: string[],
  recipeIngredients: RecipeFilterIngredientDto[],
  selectedIngredientIds: number[] = [],
) {
  const resolvedIds = selectedPantryItemIds.flatMap((pantryItemId) => {
    const item = items.find((pantryItem) => pantryItem.id === pantryItemId);
    if (!item) return [];
    const ingredientId =
      item.ingredientId ??
      recipeIngredients.find((ingredient) => ingredient.name.trim() === item.name.trim())
        ?.ingredientId;
    return ingredientId == null ? [] : [ingredientId];
  });

  return [...new Set([...selectedIngredientIds, ...resolvedIds])];
}

export function getRecipeRecommendationTitle(source: RecipeRecommendationSource) {
  return source === 'AI' ? '팬트리 기반 추천' : '인기 레시피';
}

export function getRecipeRecommendationSectionCopy(
  variant: RecipeRecommendationVariant,
  source: RecipeRecommendationSource = 'AI',
) {
  if (variant === 'personalized') {
    return {
      description:
        source === 'AI'
          ? '맛 선호도를 반영해 AI가 추천했어요.'
          : '지금 인기 있는 레시피를 추천해요.',
      moreSection: 'personalized' as const,
      title: '나를 위한 레시피',
    };
  }

  return {
    description:
      source === 'AI'
        ? '팬트리 재료로 만들 수 있는 레시피를 확인해 보세요.'
        : '인기 레시피를 확인해 보세요.',
    moreSection: 'recommendations' as const,
    title: getRecipeRecommendationTitle(source),
  };
}

export function getRecipeSections(sourceRecipes: Recipe[]): RecipeRailSection[] {
  return [
    {
      id: 'all',
      title: '전체 레시피',
      description: '등록된 레시피를 확인해 보세요.',
      recipes: sourceRecipes,
    },
  ];
}

export function getRecipeSectionById(
  _sectionId: string | undefined,
  sourceRecipes: Recipe[],
): RecipeRailSection {
  return getRecipeSections(sourceRecipes)[0];
}

function RecipeHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const cartItemCount = useCartItemCount();

  return (
    <header className="flex h-16 items-center justify-between px-4">
      <label className="focus-within:ring-ring flex h-12 w-[274px] items-center rounded-full border border-[var(--primitive-grey-300)] px-1.5 focus-within:ring-2">
        <span className="grid size-10 shrink-0 place-items-center">
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/images/recipe/search-icon.svg"
            width={24}
          />
        </span>
        <span className="sr-only">레시피 검색</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-base leading-6 outline-none placeholder:text-[var(--primitive-grey-400)]"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="검색"
          type="search"
          value={query}
        />
      </label>
      <Link
        aria-label={`장바구니 ${cartItemCount}개 상품`}
        className="relative grid size-10 place-items-center p-2"
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
    </header>
  );
}

export function RecipeActionIcon() {
  return (
    <span className="grid size-10 place-items-center p-2">
      <ChevronRight
        aria-hidden="true"
        className="size-6 text-[var(--primitive-grey-600)]"
        strokeWidth={2}
      />
    </span>
  );
}

function SectionAction({
  section,
  ingredientIds,
}: {
  section: RecipeRailSection;
  ingredientIds: number[];
}) {
  return (
    <Link
      aria-label={`${section.title} 레시피 더보기`}
      className={RECIPE_ACTION_LAYOUT.containerClassName}
      href={getRecipeMoreRoute(section.id, ingredientIds, section.title)}
    >
      <span className={RECIPE_ACTION_LAYOUT.textClassName}>더보기</span>
      <RecipeActionIcon />
    </Link>
  );
}

export function RecipeCard({
  recipe,
  variant = 'rail',
  recommendationContext,
}: {
  recipe: Recipe;
  variant?: 'rail' | 'search';
  recommendationContext?: RecipeRecommendationContext;
}) {
  const scrappedRecipesQuery = useScrappedRecipesQuery();
  const { scrap, unscrap } = useRecipeMutations();
  const [scrapError, setScrapError] = useState(false);
  const isScrapped =
    scrappedRecipesQuery.data?.some((scrapped) => scrapped.id === recipe.id) ?? false;
  const isScrapPending =
    scrappedRecipesQuery.isPending ||
    scrap.isPending ||
    unscrap.isPending ||
    scrappedRecipesQuery.isError;
  const isSearchCard = variant === 'search';
  const hasRecommendationContext =
    Boolean(recommendationContext?.requestId) && recommendationContext?.position != null;
  const recipeHref = hasRecommendationContext
    ? `/recipe/${recipe.id}?${new URLSearchParams({
        requestId: recommendationContext!.requestId!,
        position: String(recommendationContext!.position),
      }).toString()}`
    : `/recipe/${recipe.id}`;

  async function handleScrap() {
    setScrapError(false);
    try {
      const action = hasRecommendationContext
        ? {
            recipeId: recipe.id,
            requestId: recommendationContext!.requestId,
            position: recommendationContext!.position,
          }
        : recipe.id;
      await (isScrapped ? unscrap.mutateAsync(action) : scrap.mutateAsync(action));
    } catch {
      setScrapError(true);
    }
  }

  return (
    <div className={`relative shrink-0 ${isSearchCard ? 'w-[171px]' : 'w-[164px]'}`}>
      <Link className="block" href={recipeHref}>
        <div
          className={`relative overflow-hidden rounded-lg ${isSearchCard ? 'h-[171px]' : 'h-[164px]'}`}
        >
          {recipe.thumbnailUrl ? (
            <Image
              alt=""
              aria-hidden
              className="object-cover"
              fill
              sizes={isSearchCard ? '171px' : '164px'}
              src={recipe.thumbnailUrl}
              unoptimized
            />
          ) : null}
        </div>
        <div className="mt-2 h-11">
          <div className="flex items-center gap-1">
            <p className="min-w-0 flex-1 truncate text-[15px] leading-6 font-semibold">
              {recipe.name}
            </p>
          </div>
          <p className="truncate text-xs leading-5 font-normal text-[var(--primitive-grey-400)]">
            {recipe.category} · {recipe.cookTime}
          </p>
        </div>
      </Link>
      <button
        aria-label={`레시피 ${isScrapped ? '스크랩 해제' : '스크랩'}`}
        aria-pressed={isScrapped}
        className="bg-card/80 absolute top-2 right-2.5 grid size-8 place-items-center rounded-full disabled:opacity-60"
        disabled={isScrapPending}
        onClick={() => void handleScrap()}
        type="button"
      >
        <Bookmark
          aria-hidden="true"
          className="size-4"
          fill={isScrapped ? 'var(--primitive-primary-700)' : 'none'}
          stroke={isScrapped ? 'none' : 'currentColor'}
          strokeWidth={isScrapped ? 0 : 1.8}
        />
      </button>
      {scrapError ? (
        <span className="sr-only" role="status">
          스크랩을 변경하지 못했어요.
        </span>
      ) : null}
    </div>
  );
}

function RecipeSearchEmptyState() {
  return (
    <section
      aria-label="검색 결과 없음"
      className="absolute top-[269px] left-1/2 flex w-[184px] -translate-x-1/2 flex-col items-center gap-4 text-center"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="rounded-xl object-cover"
        height={160}
        src="/images/pantry/empty-image.svg"
        width={160}
      />
      <div className="text-disabled text-title-4 w-full leading-6">
        <h2 className="font-semibold">{RECIPE_SEARCH_EMPTY_COPY.title}</h2>
        <p className="font-normal">{RECIPE_SEARCH_EMPTY_COPY.descriptionLines[0]}</p>
        <p className="font-normal">{RECIPE_SEARCH_EMPTY_COPY.descriptionLines[1]}</p>
      </div>
    </section>
  );
}

function RecipeSearchResults({
  recipes,
  totalElements,
  page,
  totalPages,
  onPageChange,
}: {
  recipes: Recipe[];
  totalElements: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (getRecipeSearchResultDisplay(recipes) === 'empty') {
    return <RecipeSearchEmptyState />;
  }

  return (
    <section aria-label="레시피 검색 결과" className="px-4 pt-4 pb-8">
      <h1 className="py-4 text-base leading-6 text-[var(--primitive-grey-600)]">
        레시피 검색 결과{' '}
        <strong className="font-semibold text-[var(--primitive-primary-700)]">
          {totalElements}개
        </strong>
      </h1>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant="search" />
        ))}
      </div>
      {totalPages > 1 ? (
        <RecipeSearchPagination onPageChange={onPageChange} page={page} totalPages={totalPages} />
      ) : null}
    </section>
  );
}

function RecipeRail({
  section,
  ingredientIds,
}: {
  section: RecipeRailSection;
  ingredientIds: number[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className={RECIPE_ACTION_LAYOUT.sectionHeaderClassName}>
        <div className={RECIPE_ACTION_LAYOUT.titleBlockClassName}>
          <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{section.title}</h2>
          <p className={RECIPE_RAIL_TYPOGRAPHY.descriptionClassName}>{section.description}</p>
        </div>
        <SectionAction ingredientIds={ingredientIds} section={section} />
      </div>
      <div className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
        {section.recipes.map((recipe) => (
          <RecipeCard key={`${section.title}-${recipe.id}`} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

export function RecipeRecommendationsSection({
  authState,
  data,
  isPending,
  isError,
  error,
  onRetry,
  variant = 'pantry',
}: {
  authState: 'loading' | 'guest' | 'complete' | 'onboarding';
  data?: RecipeRecommendationsDto;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  variant?: RecipeRecommendationVariant;
}) {
  const sectionCopy = getRecipeRecommendationSectionCopy(variant, data?.source);

  if (authState === 'guest') {
    return (
      <section aria-label={sectionCopy.title} className="space-y-3">
        <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{sectionCopy.title}</h2>
        <div className="rounded-xl bg-[var(--primitive-grey-50)] p-4">
          <p className="text-body-4 text-[var(--primitive-grey-600)]">
            로그인하면 팬트리 재료와 알레르기 정보를 반영한 레시피를 추천해 드려요.
          </p>
          <Link
            className="mt-3 inline-flex h-10 items-center rounded-full bg-[var(--primitive-primary-400)] px-4 font-semibold"
            href="/login?returnTo=%2Frecipe"
          >
            로그인하고 추천 받기
          </Link>
        </div>
      </section>
    );
  }

  if (authState === 'loading' || isPending) {
    return (
      <section aria-label={sectionCopy.title} className="space-y-3" role="status">
        <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{sectionCopy.title}</h2>
        <span className="sr-only">추천 레시피를 불러오는 중입니다.</span>
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2].map((index) => (
            <div
              aria-hidden="true"
              className="h-[216px] w-[164px] shrink-0 animate-pulse rounded-lg bg-[var(--primitive-grey-100)]"
              key={index}
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    const isUnavailable = error instanceof ApiError && error.status === 503;
    return (
      <section aria-label={sectionCopy.title} className="space-y-3">
        <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{sectionCopy.title}</h2>
        <div className="rounded-xl bg-[var(--primitive-grey-50)] p-4" role="alert">
          <p className="text-body-4 text-[var(--primitive-grey-600)]">
            {isUnavailable
              ? '알레르기 정보를 확인할 수 없어 추천을 잠시 중단했어요. 잠시 후 다시 시도해 주세요.'
              : '추천 레시피를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'}
          </p>
          <button className="mt-3 font-semibold" onClick={onRetry} type="button">
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  if (data.items.length === 0) {
    return (
      <section aria-label={sectionCopy.title} className="space-y-3">
        <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{sectionCopy.title}</h2>
        <p className="text-body-4 text-[var(--primitive-grey-500)]">추천할 레시피가 없어요.</p>
      </section>
    );
  }

  return (
    <section aria-label={sectionCopy.title} className="flex flex-col gap-3">
      <div className={RECIPE_ACTION_LAYOUT.sectionHeaderClassName}>
        <div className={RECIPE_ACTION_LAYOUT.titleBlockClassName}>
          <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{sectionCopy.title}</h2>
          <p className={RECIPE_RAIL_TYPOGRAPHY.descriptionClassName}>{sectionCopy.description}</p>
        </div>
        <Link
          aria-label={`${sectionCopy.title} 더보기`}
          className={RECIPE_ACTION_LAYOUT.containerClassName}
          href={getRecipeMoreRoute(sectionCopy.moreSection)}
        >
          <span className={RECIPE_ACTION_LAYOUT.textClassName}>더보기</span>
          <RecipeActionIcon />
        </Link>
      </div>
      <div className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
        {data.items.map((item: RecipeRecommendationItemDto) => (
          <RecipeCard
            key={`${data.requestId ?? data.source}-${item.rank}-${item.recipe.recipeId}`}
            recipe={toRecipe(item.recipe)}
            recommendationContext={{ requestId: data.requestId, position: item.rank }}
          />
        ))}
      </div>
    </section>
  );
}

export function ImminentIngredientChips({
  ingredients,
  showAlert = true,
}: {
  ingredients: ImminentIngredient[];
  showAlert?: boolean;
}) {
  if (ingredients.length === 0) return null;

  const chips = (
    <div className="flex flex-wrap gap-1">
      {ingredients.map((ingredient) => (
        <span
          className={`bg-card flex items-center gap-1 rounded-full border px-3 py-1 text-[13px] leading-5 font-medium ${
            showAlert
              ? 'border-[var(--primitive-primary-400)]'
              : 'border-[var(--primitive-grey-300)]'
          }`}
          key={ingredient.name}
        >
          {ingredient.name}
          <strong
            className={`text-xs leading-[1.5] font-semibold ${
              showAlert ? 'text-[var(--primitive-warning-600)]' : 'text-[var(--primitive-grey-600)]'
            }`}
          >
            {ingredient.daysLeft === null ? '미등록' : `D-${ingredient.daysLeft}`}
          </strong>
        </span>
      ))}
    </div>
  );

  if (!showAlert) return chips;

  return (
    <div className="rounded-xl bg-[var(--primitive-primary-200)] p-3">
      <h2 className="text-base leading-6 font-semibold">기한 임박 식재료가 있어요!</h2>
      <p className="text-[13px] leading-5 text-[var(--primitive-grey-600)]">
        팬트리메이트가 활용할 수 있는 레시피를 추천해 드릴게요.
      </p>
      <div className="mt-3">{chips}</div>
    </div>
  );
}

function PantryRecipeIntro({
  imminentIngredients,
  pantryIngredients,
  selectedIngredients,
  pantryItems,
  selectedIngredientIds,
  selectedPantryItemIds,
  recipeFilterIngredients,
  selectedRecipes,
  showRecipeMatches,
  isSelectedRecipesPending,
  selectedRecipesError,
}: {
  imminentIngredients: ImminentIngredient[];
  pantryIngredients: ImminentIngredient[];
  selectedIngredients: ImminentIngredient[];
  pantryItems: PantryItem[];
  selectedIngredientIds: number[];
  selectedPantryItemIds: string[];
  recipeFilterIngredients: RecipeFilterIngredientDto[];
  selectedRecipes: Recipe[];
  showRecipeMatches: boolean;
  isSelectedRecipesPending: boolean;
  selectedRecipesError: unknown;
}) {
  const hasImminentIngredients = imminentIngredients.length > 0;
  const isSelectionResult = selectedIngredients.length > 0;
  const ingredients = isSelectionResult
    ? selectedIngredients
    : hasImminentIngredients
      ? imminentIngredients
      : pantryIngredients;

  return (
    <>
      <section className="pb-4">
        <div className={RECIPE_ACTION_LAYOUT.topHeaderClassName}>
          <h1 className="text-title-3 font-semibold">내 재료로 만드는 레시피</h1>
          <Link
            className={RECIPE_ACTION_LAYOUT.topActionClassName}
            href={getIngredientSelectionRoute()}
            onClick={() => {
              const selectedItems = selectedPantryItemIds.length
                ? selectedPantryItemIds
                : pantryItems
                    .filter((item) => {
                      const ingredientId =
                        item.ingredientId ??
                        recipeFilterIngredients.find(
                          (ingredient) => ingredient.name.trim() === item.name.trim(),
                        )?.ingredientId;
                      return ingredientId != null && selectedIngredientIds.includes(ingredientId);
                    })
                    .map((item) => item.id);
              useRecipePantrySelectionStore.getState().beginSelection(
                selectedItems.flatMap((pantryItemId) => {
                  const item = pantryItems.find((pantryItem) => pantryItem.id === pantryItemId);
                  if (!item) return [];
                  const ingredientId =
                    item.ingredientId ??
                    recipeFilterIngredients.find(
                      (ingredient) => ingredient.name.trim() === item.name.trim(),
                    )?.ingredientId;
                  return [{ pantryItemId: item.id, ingredientId }];
                }),
              );
            }}
          >
            <span className={RECIPE_ACTION_LAYOUT.textClassName}>선택하기</span>
            <RecipeActionIcon />
          </Link>
        </div>
        {ingredients.length > 0 ? (
          <div className={RECIPE_ACTION_LAYOUT.topPanelClassName}>
            <ImminentIngredientChips
              ingredients={ingredients}
              showAlert={!isSelectionResult && hasImminentIngredients}
            />
          </div>
        ) : null}
        {showRecipeMatches ? (
          <div className="mt-4">
            {isSelectedRecipesPending ? (
              <p className="px-4 text-sm text-[var(--primitive-grey-500)]" role="status">
                재료로 만들 수 있는 레시피를 찾고 있어요.
              </p>
            ) : selectedRecipesError ? (
              <p className="px-4 text-sm text-[var(--primitive-grey-500)]" role="alert">
                재료의 레시피를 불러오지 못했어요.
              </p>
            ) : selectedRecipes.length > 0 ? (
              <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
                {selectedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="px-4 text-sm text-[var(--primitive-grey-500)]">
                재료로 만들 수 있는 레시피가 없어요.
              </p>
            )}
          </div>
        ) : null}
      </section>
      <div aria-hidden="true" className={RECIPE_PANTRY_DIVIDER_CLASS} />
    </>
  );
}

export function RecipeListPage({
  selectedIngredientIds = [],
  selectedPantryItemIds = [],
}: {
  selectedIngredientIds?: number[];
  selectedPantryItemIds?: string[];
}) {
  const ingredientIds = selectedIngredientIds;
  const { state: authState } = useAuthSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPageIndex, setSearchPageIndex] = useState(0);
  const contentMode = getRecipeContentMode(searchQuery);
  const { data: pantryItems = [], isPending: isPantryPending } = usePantriesQuery();
  const personalizedRecommendationQuery = useRecipeRecommendationsQuery(
    shouldEnableRecipeRecommendations(authState, contentMode, 'personalized'),
    10,
    false,
  );
  const recommendationQuery = useRecipeRecommendationsQuery(
    shouldEnableRecipeRecommendations(authState, contentMode, 'pantry') && pantryItems.length > 0,
    20,
    true,
  );
  const recipePantryItemIds =
    selectedPantryItemIds.length > 0
      ? selectedPantryItemIds
      : ingredientIds.length === 0
        ? getRecipePantryItemIds(pantryItems)
        : [];
  const showRecipeMatches = ingredientIds.length > 0 || recipePantryItemIds.length > 0;
  const {
    data: recipeFilterIngredients = [],
    error: recipeFilterIngredientsError,
    isPending: isRecipeFilterIngredientsPending,
  } = useRecipeFilterIngredientsQuery(ingredientIds.length > 0 || recipePantryItemIds.length > 0);
  const resolvedIngredientIds = getSelectedRecipeIngredientIds(
    pantryItems,
    recipePantryItemIds,
    recipeFilterIngredients,
    ingredientIds,
  );
  const isResolvingRecipePantryItems =
    recipePantryItemIds.length > 0 && (isPantryPending || isRecipeFilterIngredientsPending);
  const cannotResolveRecipePantryItems =
    recipePantryItemIds.length > 0 &&
    !isResolvingRecipePantryItems &&
    resolvedIngredientIds.length === 0;
  const shouldFetchRecipeMatches =
    showRecipeMatches &&
    !isResolvingRecipePantryItems &&
    !cannotResolveRecipePantryItems &&
    resolvedIngredientIds.length > 0;
  const {
    data: selectedRecipePage,
    error: selectedRecipesError,
    isPending: isSelectedRecipesPending,
  } = useRecipesQuery({ ingredientIds: resolvedIngredientIds }, shouldFetchRecipeMatches);
  const { data: recipePage, error, isPending, refetch } = useRecipesQuery();
  const {
    data: searchResultsPage,
    error: searchError,
    isPending: isSearchPending,
    refetch: refetchSearch,
  } = useRecipeSearchQuery(searchQuery.trim(), searchPageIndex, 20);
  const recipes = recipePage?.content ?? [];
  const sections = getRecipeSections(recipes);
  const searchedRecipes = searchResultsPage?.content ?? [];
  const displayMode = getRecipeDisplayMode(pantryItems);
  const imminentIngredients = getImminentIngredients(pantryItems);
  const pantryIngredients = getAvailablePantryIngredients(pantryItems);
  const selectedIngredients = getAvailablePantryIngredients(
    pantryItems,
    ingredientIds,
    recipeFilterIngredients,
    selectedPantryItemIds,
  );

  const handleSearchQueryChange = (query: string) => {
    setSearchPageIndex(0);
    setSearchQuery(query);
  };

  if (getRecipeViewState(error) === 'error') {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <RecipeHeader onQueryChange={handleSearchQueryChange} query={searchQuery} />
        <SystemErrorState onRetry={() => void refetch()} title="레시피를 불러오지 못했어요" />
        <BottomNavigation />
      </main>
    );
  }

  if (isPending && !(selectedPantryItemIds.length > 0 && cannotResolveRecipePantryItems)) {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <RecipeHeader onQueryChange={handleSearchQueryChange} query={searchQuery} />
        <div className="flex flex-1 items-center justify-center" role="status">
          <span className="sr-only">레시피를 불러오는 중입니다.</span>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
      <RecipeHeader onQueryChange={handleSearchQueryChange} query={searchQuery} />
      {contentMode === 'search' ? (
        searchError ? (
          <SystemErrorState
            onRetry={() => void refetchSearch()}
            title="검색 결과를 불러오지 못했어요"
          />
        ) : isSearchPending ? (
          <div className="flex flex-1 items-center justify-center" role="status">
            <span className="sr-only">레시피 검색 중입니다.</span>
          </div>
        ) : (
          <RecipeSearchResults
            recipes={searchedRecipes}
            totalElements={searchResultsPage?.totalElements ?? 0}
            totalPages={searchResultsPage?.totalPages ?? 0}
            page={searchPageIndex}
            onPageChange={setSearchPageIndex}
          />
        )
      ) : (
        <>
          {displayMode === 'pantry' ? (
            <PantryRecipeIntro
              imminentIngredients={imminentIngredients}
              pantryIngredients={pantryIngredients}
              pantryItems={pantryItems}
              selectedIngredients={selectedIngredients}
              selectedIngredientIds={ingredientIds}
              selectedPantryItemIds={selectedPantryItemIds}
              selectedRecipes={selectedRecipePage?.content ?? []}
              showRecipeMatches={showRecipeMatches}
              isSelectedRecipesPending={
                showRecipeMatches &&
                (isResolvingRecipePantryItems ||
                  (shouldFetchRecipeMatches && isSelectedRecipesPending))
              }
              selectedRecipesError={getPantryRecipeMatchError(
                selectedRecipesError,
                recipePantryItemIds.length > 0 ? recipeFilterIngredientsError : null,
              )}
              recipeFilterIngredients={recipeFilterIngredients}
            />
          ) : null}
          <div className="flex flex-1 flex-col gap-8 px-4 pt-2 pb-8">
            {authState === 'complete' ? (
              <RecipeRecommendationsSection
                authState={authState}
                data={personalizedRecommendationQuery.data}
                error={personalizedRecommendationQuery.error}
                isError={personalizedRecommendationQuery.isError}
                isPending={personalizedRecommendationQuery.isPending}
                onRetry={() => void personalizedRecommendationQuery.refetch()}
                variant="personalized"
              />
            ) : null}
            {pantryItems.length > 0 ? (
              <RecipeRecommendationsSection
                authState={authState}
                data={recommendationQuery.data}
                error={recommendationQuery.error}
                isError={recommendationQuery.isError}
                isPending={recommendationQuery.isPending}
                onRetry={() => void recommendationQuery.refetch()}
              />
            ) : null}
            {sections.map((section) => (
              <RecipeRail ingredientIds={ingredientIds} key={section.title} section={section} />
            ))}
          </div>
        </>
      )}
      <BottomNavigation />
    </main>
  );
}
