'use client';

import { Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';
import { recipeMocks } from '@/entities/recipe/model/mock';
import {
  selectScrappedRecipeIds,
  useScrappedRecipeStore,
} from '@/entities/recipe/model/scrapped-recipe-store';
import type { Recipe } from '@/entities/recipe/model/types';
import { BackButton } from '@/shared/ui/back-button';

import { selectScrappedRecipes } from '../model/scrapped-recipes';

function ScrappedRecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="relative min-w-0">
      <Link
        aria-label={`${recipe.name}, ${recipe.category}, ${recipe.cookTime} 레시피 상세 보기`}
        className="focus-visible:ring-ring block rounded-[8px] focus-visible:ring-2"
        href={`/recipe/${recipe.id}`}
      >
        <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-[8px]">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="171px"
            src="/images/delivery/antibiotic-free-eggs.png"
          />
        </div>
        <div className="mt-2 leading-[1.5]">
          <p className="truncate text-[15px] leading-[1.5] font-semibold">{recipe.name}</p>
          <p className="text-[13px] leading-[1.5] font-normal text-[var(--primitive-grey-400)]">
            {recipe.category} · {recipe.cookTime}
          </p>
        </div>
      </Link>
      <span className="bg-card/80 absolute top-2 right-2.5 grid size-8 place-items-center rounded-full">
        <Bookmark
          aria-label="스크랩한 레시피"
          fill="var(--primitive-primary-700)"
          size={16}
          stroke="none"
          strokeWidth={0}
        />
      </span>
    </article>
  );
}

export function scrappedRecipesEmptyState() {
  return (
    <section
      aria-label="스크랩한 레시피 없음"
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
        <h2 className="font-semibold">스크랩한 레시피가 없어요</h2>
        <p className="font-normal">자주 보는 레시피를 스크랩해 보세요</p>
      </div>
    </section>
  );
}

export function ScrappedRecipesPage() {
  const scrappedRecipeIds = useScrappedRecipeStore(selectScrappedRecipeIds);
  const hasHydrated = useScrappedRecipeStore((state) => state.hasHydrated);
  const { data: apiRecipes } = useRecipesQuery();
  const scrappedRecipes = selectScrappedRecipes(scrappedRecipeIds, apiRecipes ?? recipeMocks);

  useEffect(() => {
    void useScrappedRecipeStore.persist.rehydrate();
  }, []);

  return (
    <main className="mobile-page bg-background min-h-dvh">
      <header className="relative flex h-16 items-center px-2">
        <BackButton fallbackHref="/mypage" />
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">
          스크랩 레시피
        </h1>
      </header>

      {!hasHydrated ? (
        <div className="py-16 text-center" role="status">
          <span className="sr-only">스크랩 레시피를 불러오는 중입니다.</span>
        </div>
      ) : scrappedRecipes.length === 0 ? (
        scrappedRecipesEmptyState()
      ) : (
        <section
          aria-label="스크랩 레시피 목록"
          className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pt-2 pb-8"
        >
          {scrappedRecipes.map((recipe) => (
            <ScrappedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  );
}
