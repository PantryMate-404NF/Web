'use client';

import { Bookmark, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { useRecipeSearchQuery } from '@/entities/recipe/api/use-recipe-search-query';
import { useRecipeMutations } from '@/entities/recipe/api/use-recipe-mutations';
import { useScrappedRecipesQuery } from '@/entities/recipe/api/use-scrapped-recipes-query';
import { usePantriesQuery } from '@/entities/pantry/api/use-pantries-query';
import type { PantryItem } from '@/entities/pantry/model/types';
import type { Recipe } from '@/entities/recipe/model/types';
import { SystemErrorState } from '@/shared/ui/system-error-state';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

export type RecipeSectionId = 'all';

export interface RecipeRailSection {
  id: RecipeSectionId;
  title: string;
  description: string;
  recipes: Recipe[];
}

export interface ImminentIngredient {
  name: string;
  daysLeft: number;
}

export type RecipeDisplayMode = 'pantry' | 'basic';
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

export const RECIPE_SEARCH_EMPTY_COPY = {
  title: '검색 결과가 없어요.',
  descriptionLines: ['다른 검색어를 입력하거나', '맞춤법을 확인해보세요'],
} as const;

export function getIngredientSelectionRoute(): string {
  return '/recipe/ingredients';
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

export function getRecipeContentMode(query: string): 'search' | 'list' {
  return query.trim() ? 'search' : 'list';
}

export function getRecipeViewState(error: unknown): 'content' | 'error' {
  return error ? 'error' : 'content';
}

export function getRecipeSearchResultDisplay(recipes: Recipe[]): 'results' | 'empty' {
  return recipes.length === 0 ? 'empty' : 'results';
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

export function getAvailablePantryIngredients(items: PantryItem[]): ImminentIngredient[] {
  return items
    .filter((item) => item.availability === 'AVAILABLE' && item.daysUntilExpiration !== null)
    .slice(0, 3)
    .map((item) => ({ name: item.name, daysLeft: item.daysUntilExpiration! }));
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
      <Link aria-label="장바구니" className="grid size-10 place-items-center p-2" href="/cart">
        <Image
          alt=""
          aria-hidden="true"
          height={24}
          src="/images/recipe/shopping-cart-icon.svg"
          width={24}
        />
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
}: {
  recipe: Recipe;
  variant?: 'rail' | 'search';
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

  async function handleScrap() {
    setScrapError(false);
    try {
      await (isScrapped ? unscrap.mutateAsync(recipe.id) : scrap.mutateAsync(recipe.id));
    } catch {
      setScrapError(true);
    }
  }

  return (
    <div className={`relative shrink-0 ${isSearchCard ? 'w-[171px]' : 'w-[164px]'}`}>
      <Link className="block" href={`/recipe/${recipe.id}`}>
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
}: {
  recipes: Recipe[];
  totalElements: number;
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
            D-{ingredient.daysLeft}
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
        보유 재료 기반 추천은 아직 제공되지 않아요. 아래 전체 레시피를 확인해 주세요.
      </p>
      <div className="mt-3">{chips}</div>
    </div>
  );
}

function PantryRecipeIntro({
  imminentIngredients,
  pantryIngredients,
}: {
  imminentIngredients: ImminentIngredient[];
  pantryIngredients: ImminentIngredient[];
}) {
  const hasImminentIngredients = imminentIngredients.length > 0;
  const ingredients = hasImminentIngredients ? imminentIngredients : pantryIngredients;

  return (
    <section className="border-b-[8px] border-[var(--primitive-grey-100)] pb-4">
      <div className={RECIPE_ACTION_LAYOUT.topHeaderClassName}>
        <h1 className="text-title-3 font-semibold">내 재료로 만드는 레시피</h1>
        <Link
          className={RECIPE_ACTION_LAYOUT.topActionClassName}
          href={getIngredientSelectionRoute()}
        >
          <span className={RECIPE_ACTION_LAYOUT.textClassName}>선택하기</span>
          <RecipeActionIcon />
        </Link>
      </div>
      {ingredients.length > 0 ? (
        <div className={RECIPE_ACTION_LAYOUT.topPanelClassName}>
          <ImminentIngredientChips ingredients={ingredients} showAlert={hasImminentIngredients} />
        </div>
      ) : null}
    </section>
  );
}

export function RecipeListPage({
  selectedIngredientIds = [],
}: {
  selectedIngredientIds?: number[];
}) {
  const ingredientIds = selectedIngredientIds;
  const [searchQuery, setSearchQuery] = useState('');
  const { data: recipePage, error, isPending, refetch } = useRecipesQuery({ ingredientIds });
  const {
    data: searchPage,
    error: searchError,
    isPending: isSearchPending,
    refetch: refetchSearch,
  } = useRecipeSearchQuery(searchQuery.trim());
  const recipes = recipePage?.content ?? [];
  const sections = getRecipeSections(recipes);
  const searchedRecipes = searchPage?.content ?? [];
  const contentMode = getRecipeContentMode(searchQuery);
  const { data: pantryItems = [] } = usePantriesQuery();
  const displayMode = getRecipeDisplayMode(pantryItems);
  const imminentIngredients = getImminentIngredients(pantryItems);
  const pantryIngredients = getAvailablePantryIngredients(pantryItems);

  if (getRecipeViewState(error) === 'error') {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <RecipeHeader onQueryChange={setSearchQuery} query={searchQuery} />
        <SystemErrorState onRetry={() => void refetch()} title="레시피를 불러오지 못했어요" />
        <BottomNavigation />
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
        <RecipeHeader onQueryChange={setSearchQuery} query={searchQuery} />
        <div className="flex flex-1 items-center justify-center" role="status">
          <span className="sr-only">레시피를 불러오는 중입니다.</span>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
      <RecipeHeader onQueryChange={setSearchQuery} query={searchQuery} />
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
            totalElements={searchPage?.totalElements ?? 0}
          />
        )
      ) : (
        <>
          {displayMode === 'pantry' ? (
            <PantryRecipeIntro
              imminentIngredients={imminentIngredients}
              pantryIngredients={pantryIngredients}
            />
          ) : null}
          <div className="flex flex-1 flex-col gap-8 px-4 pt-2 pb-8">
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
