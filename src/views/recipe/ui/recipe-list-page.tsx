import { Heart, Image as ImageIcon, Search } from 'lucide-react';
import Link from 'next/link';

import { recipeMocks } from '@/entities/recipe/model/mock';
import type { RecipeTab } from '@/entities/recipe/model/types';

interface RecipeRailSection {
  title: string;
  recipes: typeof recipeMocks;
}

const mainIngredients = ['계란', '감자', '대파', '두부', '돼지고기'];

export function getRecipeTab(tab?: string): RecipeTab {
  return tab === 'imminent' ? 'imminent' : 'main';
}

export function getRecipeRoute(tab: RecipeTab): string {
  return tab === 'imminent' ? '/recipe/imminent' : '/recipe';
}

export function getIngredientSelectionRoute(): string {
  return '/recipe/ingredients';
}

export function getRecipeSections(tab: RecipeTab): RecipeRailSection[] {
  const expiringRecipes = recipeMocks.filter((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.isImminent),
  );

  return [
    {
      title: tab === 'main' ? '주재료 레시피(임시)' : '기한 임박! 이 레시피는 어떠세요',
      recipes: tab === 'main' ? recipeMocks : expiringRecipes,
    },
    { title: '이 달의 인기 레시피(임시)', recipes: recipeMocks },
    { title: '최근 본 레시피(임시)', recipes: recipeMocks.slice(0, 2) },
  ];
}

function RecipeImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      aria-label="레시피 이미지 자리"
      className={`flex items-center justify-center rounded-2xl bg-[#c5c6c9] text-[#949497] ${className}`}
      role="img"
    >
      <ImageIcon aria-hidden="true" className="size-6" />
    </div>
  );
}

function ExpiringRecipeCard({ recipe }: { recipe: (typeof recipeMocks)[number] }) {
  const imminentIngredient = recipe.ingredients.find((ingredient) => ingredient.isImminent);

  return (
    <Link
      className="relative h-[318px] w-[234px] shrink-0 rounded-2xl bg-[#eff0f4] p-3"
      href={`/recipe/${recipe.id}`}
    >
      <span className="text-foreground text-label-3 inline-flex rounded-full bg-[#c5c6c9] px-4 py-1 font-medium">
        {imminentIngredient?.name ?? '식재료'} D-2
      </span>
      <RecipeImagePlaceholder className="absolute top-[62px] left-1/2 size-40 -translate-x-1/2" />
      <p className="text-foreground text-label-4 absolute right-0 bottom-[62px] left-0 mx-auto h-[22px] w-[142px] rounded-full bg-[#949497] px-3 pt-0.5 text-center">
        {recipe.name}
      </p>
      <p className="text-foreground text-label-4 absolute right-0 bottom-[38px] left-0 mx-auto h-4 w-[156px] rounded-full bg-[#b9b9bc] px-3 text-center">
        {recipe.cookTime} · 부족 재료 {recipe.missingCount}개
      </p>
    </Link>
  );
}

function MainIngredientRecipeCard({ recipe }: { recipe: (typeof recipeMocks)[number] }) {
  return (
    <Link className="w-[176px] shrink-0" href={`/recipe/${recipe.id}`}>
      <RecipeImagePlaceholder className="h-[184px] w-full" />
      <p className="text-foreground text-label-4 mt-1 h-5 w-[142px] max-w-full truncate rounded-full bg-[#949497] px-2 text-center">
        {recipe.name}
      </p>
      <p className="text-foreground text-label-4 mt-1 h-4 w-full truncate rounded-full bg-[#b9b9bc] px-2 text-center">
        {recipe.cookTime} · 부족 재료 {recipe.missingCount}개
      </p>
    </Link>
  );
}

function CompactRecipeCard({ recipe }: { recipe: (typeof recipeMocks)[number] }) {
  return (
    <Link className="w-[156px] shrink-0" href={`/recipe/${recipe.id}`}>
      <RecipeImagePlaceholder className="h-24 w-[156px]" />
      <p className="text-foreground text-label-4 mt-1 h-5 w-[142px] truncate rounded-full bg-[#949497] px-2 text-center">
        {recipe.name}
      </p>
      <p className="text-foreground text-label-4 mt-1 h-4 w-full truncate rounded-full bg-[#b9b9bc] px-2 text-center">
        {recipe.category}
      </p>
    </Link>
  );
}

function RecipeTabNavigation() {
  return (
    <nav
      aria-label="레시피 탭"
      className="mx-4 flex h-12 items-center justify-between bg-[#eff0f4] p-2"
    >
      <div className="flex gap-2" role="tablist">
        <Link
          aria-selected
          className="bg-accent text-title-4 flex h-8 items-center rounded-full px-4 font-medium"
          href={getRecipeRoute('main')}
          role="tab"
        >
          추천
        </Link>
        <button
          aria-selected={false}
          className="bg-accent text-title-4 flex h-8 items-center gap-1 rounded-full px-4 font-medium"
          role="tab"
          type="button"
        >
          <Heart aria-hidden="true" className="size-3.5" />찜
        </button>
      </div>
      <Link
        aria-label="레시피 검색"
        className="flex size-10 items-center justify-center"
        href={getRecipeRoute('main')}
      >
        <Search aria-hidden="true" className="size-5" />
      </Link>
    </nav>
  );
}

function MainIngredientSection({ recipes }: { recipes: typeof recipeMocks }) {
  return (
    <section className="rounded-2xl bg-[#eff0f4] p-2 pb-4">
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-title-3 font-semibold">주재료 레시피(임시)</h1>
        <span aria-hidden="true" className="h-4 w-12 rounded-full bg-[#c5c6c9]" />
      </div>
      <div className="mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto">
        {mainIngredients.map((ingredient) => (
          <Link
            className="flex w-[72px] shrink-0 flex-col items-center px-1 py-2"
            href={getIngredientSelectionRoute()}
            key={ingredient}
          >
            <div className="flex size-16 items-center justify-center rounded-lg bg-[#c5c6c9] text-[#949497]">
              <ImageIcon aria-hidden="true" className="size-5" />
            </div>
            <span className="text-body-4 mt-1 font-medium">{ingredient}</span>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
        {recipes.map((recipe) => (
          <MainIngredientRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

export function RecipeListPage({ tab = 'main' }: { tab?: RecipeTab }) {
  const sections = getRecipeSections(tab);

  return (
    <main className="bg-background text-foreground mx-auto min-h-dvh w-full max-w-[390px] overflow-hidden pb-8">
      <RecipeTabNavigation />

      {tab === 'imminent' ? (
        <section className="mt-7">
          <h1 className="text-title-3 px-6 font-semibold">{sections[0].title}</h1>
          <div className="mt-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-6 pb-1">
            {sections[0].recipes.map((recipe) => (
              <ExpiringRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-4 px-4">
          <MainIngredientSection recipes={sections[0].recipes} />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-4 px-4">
        {sections.slice(1).map((section) => (
          <section className="rounded-2xl bg-[#eff0f4] p-2 pb-4" key={section.title}>
            <div className="flex h-10 items-center justify-between">
              <h2 className="text-title-3 font-semibold">{section.title}</h2>
              <span aria-hidden="true" className="h-4 w-12 rounded-full bg-[#c5c6c9]" />
            </div>
            <div className="mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto">
              {section.recipes.map((recipe) => (
                <CompactRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
