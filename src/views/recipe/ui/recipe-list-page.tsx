'use client';

import { Bookmark, ChevronRight, ShoppingCart, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { recipeMocks } from '@/entities/recipe/model/mock';
import { useScrappedRecipeStore } from '@/entities/recipe/model/scrapped-recipe-store';
import { usePantriesQuery } from '@/entities/pantry/api/use-pantries-query';
import type { PantryItem } from '@/entities/pantry/model/types';
import type { Recipe, RecipeTab } from '@/entities/recipe/model/types';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

interface RecipeRailSection {
  title: string;
  description: string;
  recipes: Recipe[];
}

export interface ImminentIngredient {
  name: string;
  daysLeft: number;
}

export type RecipeDisplayMode = 'pantry' | 'basic';
export type RecipePantryMockMode = 'imminent' | 'normal' | null;

const recipeImageSrc = '/images/delivery/antibiotic-free-eggs.png';

const recipePantryMockItems: PantryItem[] = [
  {
    id: 'pork',
    name: '돼지고기',
    daysUntilExpiration: 1,
    expirationLabel: '소비기한 1일 남음',
    expirationStatus: 'IMMINENT',
    availability: 'AVAILABLE',
    imageAlt: '돼지고기 이미지',
  },
  {
    id: 'green-onion',
    name: '대파',
    daysUntilExpiration: 2,
    expirationLabel: '소비기한 2일 남음',
    expirationStatus: 'IMMINENT',
    availability: 'AVAILABLE',
    imageAlt: '대파 이미지',
  },
  {
    id: 'carrot',
    name: '당근',
    daysUntilExpiration: 3,
    expirationLabel: '소비기한 3일 남음',
    expirationStatus: 'IMMINENT',
    availability: 'AVAILABLE',
    imageAlt: '당근 이미지',
  },
  {
    id: 'egg',
    name: '계란',
    daysUntilExpiration: 20,
    expirationLabel: '소비기한 20일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '계란 이미지',
  },
  {
    id: 'potato',
    name: '감자',
    daysUntilExpiration: 25,
    expirationLabel: '소비기한 25일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '감자 이미지',
  },
];

const recipePantryNormalMockItems: PantryItem[] = [
  {
    id: 'pork',
    name: '돼지고기',
    daysUntilExpiration: 5,
    expirationLabel: '소비기한 5일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '돼지고기 이미지',
  },
  {
    id: 'green-onion',
    name: '대파',
    daysUntilExpiration: 8,
    expirationLabel: '소비기한 8일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '대파 이미지',
  },
  {
    id: 'garlic',
    name: '다진 마늘',
    daysUntilExpiration: 14,
    expirationLabel: '소비기한 14일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '다진 마늘 이미지',
  },
  {
    id: 'egg',
    name: '계란',
    daysUntilExpiration: 7,
    expirationLabel: '소비기한 7일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '계란 이미지',
  },
  {
    id: 'potato',
    name: '감자',
    daysUntilExpiration: 10,
    expirationLabel: '소비기한 10일 남음',
    expirationStatus: 'NORMAL',
    availability: 'AVAILABLE',
    imageAlt: '감자 이미지',
  },
];

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

export function getRecipeTab(tab?: string): RecipeTab {
  return tab === 'imminent' ? 'imminent' : 'main';
}

export function getRecipeRoute(tab: RecipeTab): string {
  return tab === 'imminent' ? '/recipe/imminent' : '/recipe';
}

export function getIngredientSelectionRoute(): string {
  return '/recipe/ingredients';
}

export function getRecipeDisplayMode(items: PantryItem[]): RecipeDisplayMode {
  return items.length > 0 ? 'pantry' : 'basic';
}

export function getRecipePantryItems(
  items: PantryItem[],
  mockPantryMode: RecipePantryMockMode,
): PantryItem[] {
  if (mockPantryMode === 'imminent') return recipePantryMockItems;
  if (mockPantryMode === 'normal') return recipePantryNormalMockItems;

  return items;
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

export function getPantryRecipeRecommendations(items: PantryItem[]): Recipe[] {
  const prioritizedIngredientIds = [...items]
    .filter(
      (item): item is PantryItem & { daysUntilExpiration: number } =>
        item.availability === 'AVAILABLE' && item.daysUntilExpiration !== null,
    )
    .sort((left, right) => left.daysUntilExpiration - right.daysUntilExpiration)
    .slice(0, 3)
    .map((item) => item.id);

  const priorityByIngredientId = new Map(
    prioritizedIngredientIds.map((ingredientId, index) => [ingredientId, index]),
  );

  return [...recipeMocks].sort((left, right) => {
    const leftPriority = getRecipePantryPriority(left, priorityByIngredientId);
    const rightPriority = getRecipePantryPriority(right, priorityByIngredientId);

    return (
      leftPriority.closestIngredientRank - rightPriority.closestIngredientRank ||
      rightPriority.matchedIngredientCount - leftPriority.matchedIngredientCount
    );
  });
}

function getRecipePantryPriority(recipe: Recipe, priorityByIngredientId: Map<string, number>) {
  const matchedRanks = recipe.ingredients
    .map((ingredient) => priorityByIngredientId.get(ingredient.id))
    .filter((rank): rank is number => rank !== undefined);

  return {
    closestIngredientRank: matchedRanks.length > 0 ? Math.min(...matchedRanks) : Infinity,
    matchedIngredientCount: matchedRanks.length,
  };
}

export function getRecipeSections(
  tab: RecipeTab,
  sourceRecipes = recipeMocks,
): RecipeRailSection[] {
  const imminentRecipes = sourceRecipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.isImminent),
  );
  const recipes = tab === 'imminent' ? imminentRecipes : sourceRecipes;

  return [
    {
      title: '후기 많은 인기 레시피',
      description: '직접 만들어본 분들의 후기로 검증된 레시피예요.',
      recipes,
    },
    {
      title: '스크랩 수가 말해주는 레시피',
      description: '저장해두고 계속 찾게 되는 레시피예요.',
      recipes,
    },
    {
      title: '가장 많이 공유된 레시피',
      description: '주변에 알리고 싶은 공유 랭킹 레시피를 모았어요.',
      recipes,
    },
    {
      title: '끝까지 만들기 좋은 레시피',
      description: '실제로 레시피를 완성한 후보들로 추려봤어요.',
      recipes,
    },
    {
      title: '오늘의 랜덤 레시피',
      description: '팬트리 메이트가 오늘을 위해 골라봤어요.',
      recipes,
    },
  ];
}

function RecipeHeader() {
  return (
    <header className="flex h-16 items-center justify-between pr-4 pl-6">
      <Link
        aria-label="마이페이지"
        className="bg-muted grid size-11 place-items-center rounded-full"
        href="/mypage"
      >
        <UserRound aria-hidden="true" className="text-muted-foreground size-5" />
      </Link>
      <Link aria-label="장바구니" className="grid size-10 place-items-center p-2" href="/cart">
        <ShoppingCart aria-hidden="true" className="size-6" strokeWidth={1.8} />
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

function SectionAction({ label }: { label: string }) {
  return (
    <Link
      aria-label={`${label} 레시피 더보기`}
      className={RECIPE_ACTION_LAYOUT.containerClassName}
      href="/recipe"
    >
      <span className={RECIPE_ACTION_LAYOUT.textClassName}>더보기</span>
      <RecipeActionIcon />
    </Link>
  );
}

export function RecipeCard({ recipe, rank }: { recipe: Recipe; rank?: number }) {
  const isScrapped = useScrappedRecipeStore((state) => state.scrappedRecipeIds.includes(recipe.id));

  return (
    <div className="relative w-[164px] shrink-0">
      <Link className="block" href={`/recipe/${recipe.id}`}>
        <div className="relative h-[164px] overflow-hidden rounded-lg">
          <Image
            alt=""
            aria-hidden
            className="object-cover"
            fill
            sizes="164px"
            src={recipeImageSrc}
          />
        </div>
        <div className="mt-2 h-11">
          <div className="flex items-center gap-1">
            <p className="min-w-0 flex-1 truncate text-[15px] leading-6 font-semibold">
              {recipe.name}
            </p>
            {rank ? (
              <span
                className={`rounded-full px-2 text-xs leading-[18px] font-medium ${
                  rank === 1
                    ? 'bg-[var(--primitive-primary-300)]'
                    : 'bg-[var(--primitive-secondary-300)]'
                }`}
              >
                {rank}위
              </span>
            ) : null}
          </div>
          <p className="text-tertiary truncate text-[13px] leading-5">
            {recipe.category} · {recipe.cookTime}
          </p>
        </div>
      </Link>
      <span
        aria-label="레시피 저장 상태"
        className="bg-card/80 absolute top-2 right-2.5 grid size-8 place-items-center rounded-full"
      >
        <Bookmark
          aria-hidden="true"
          className="size-4"
          fill={isScrapped ? 'var(--primitive-primary-700)' : 'none'}
          stroke={isScrapped ? 'none' : 'currentColor'}
          strokeWidth={isScrapped ? 0 : 1.8}
        />
      </span>
    </div>
  );
}

function RecipeRail({
  section,
  sectionIndex,
}: {
  section: RecipeRailSection;
  sectionIndex: number;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className={RECIPE_ACTION_LAYOUT.sectionHeaderClassName}>
        <div className={RECIPE_ACTION_LAYOUT.titleBlockClassName}>
          <h2 className={RECIPE_RAIL_TYPOGRAPHY.titleClassName}>{section.title}</h2>
          <p className={RECIPE_RAIL_TYPOGRAPHY.descriptionClassName}>{section.description}</p>
        </div>
        <SectionAction label={section.title} />
      </div>
      <div className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
        {section.recipes.map((recipe, recipeIndex) => (
          <RecipeCard
            key={`${section.title}-${recipe.id}`}
            rank={sectionIndex < 2 ? recipeIndex + 1 : undefined}
            recipe={recipe}
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
        팬트리메이트가 활용할 수 있는 레시피를 추천해 드릴게요.
      </p>
      <div className="mt-3">{chips}</div>
    </div>
  );
}

function PantryRecipeIntro({
  imminentIngredients,
  pantryIngredients,
  recipes,
}: {
  imminentIngredients: ImminentIngredient[];
  pantryIngredients: ImminentIngredient[];
  recipes: Recipe[];
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
      <div className="mt-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

export function RecipeListPage({
  tab = 'main',
  mockPantryMode = null,
}: {
  tab?: RecipeTab;
  mockPantryMode?: RecipePantryMockMode;
}) {
  useEffect(() => {
    void useScrappedRecipeStore.persist.rehydrate();
  }, []);

  const { data: apiRecipes } = useRecipesQuery();
  const sections = getRecipeSections(tab, apiRecipes ?? recipeMocks);
  const { data: pantryItems = [] } = usePantriesQuery();
  const recipePantryItems = getRecipePantryItems(pantryItems, mockPantryMode);
  const displayMode = getRecipeDisplayMode(recipePantryItems);
  const imminentIngredients = getImminentIngredients(recipePantryItems);
  const pantryIngredients = getAvailablePantryIngredients(recipePantryItems);
  const pantryRecipes = getPantryRecipeRecommendations(recipePantryItems);

  return (
    <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
      <RecipeHeader />
      {displayMode === 'pantry' ? (
        <PantryRecipeIntro
          imminentIngredients={imminentIngredients}
          pantryIngredients={pantryIngredients}
          recipes={pantryRecipes}
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-8 px-4 py-4 pb-8">
        {sections.map((section, index) => (
          <RecipeRail key={section.title} section={section} sectionIndex={index} />
        ))}
      </div>
      <BottomNavigation />
    </main>
  );
}
