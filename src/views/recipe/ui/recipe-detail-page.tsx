import { ChefHat, ChevronLeft, Clock3, Heart, Package } from 'lucide-react';
import Link from 'next/link';

import { getRecipeById } from '@/entities/recipe/model/mock';
import { RecipeCartActions } from '@/features/recipe-cart/ui/recipe-cart-actions';

interface RecipeDetailPageProps {
  recipeId: string;
}

export function RecipeDetailPage({ recipeId }: RecipeDetailPageProps) {
  const recipe = getRecipeById(recipeId);
  const owned = recipe.ingredients.filter((ingredient) => ingredient.isOwned);
  const missing = recipe.ingredients.filter((ingredient) => !ingredient.isOwned);
  const visibleIngredients = owned.slice(0, 3);
  const statusChips = [
    owned.length === recipe.ingredients.length ? '전체 보유' : '일부 보유',
    owned.some((ingredient) => ingredient.isImminent) ? '기한 임박' : null,
    missing.length > 0 ? `식재료 ${missing.length}개 부족` : null,
  ].filter(Boolean);

  return (
    <main className="bg-background text-foreground mx-auto min-h-dvh w-full max-w-[390px] pb-28">
      <section className="bg-muted text-muted-foreground relative flex h-[211px] items-center justify-center">
        <Link
          aria-label="이전 페이지"
          className="bg-card text-foreground absolute top-4 left-4 grid size-10 place-items-center rounded-full"
          href="/recipe"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </Link>
        <ChefHat aria-hidden="true" className="size-10" strokeWidth={1.5} />
      </section>
      <div className="px-4">
        <section className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-heading-2 font-semibold">{recipe.name}</h1>
              <div className="text-body-4 text-muted-foreground mt-2 flex items-center gap-1.5">
                <span>{recipe.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 aria-hidden="true" className="size-3.5" />약 {recipe.cookTime}
                </span>
              </div>
            </div>
            <button
              aria-label={`${recipe.name} 찜하기`}
              className="grid size-10 shrink-0 place-items-center rounded-full"
              type="button"
            >
              <Heart aria-hidden="true" className="size-6" strokeWidth={1.75} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {statusChips.map((status) => (
              <span
                className="bg-muted text-label-4 rounded-full px-2.5 py-1 font-medium"
                key={status}
              >
                {status}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-title-4 font-semibold">보유 식재료</h2>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {visibleIngredients.map((ingredient) => {
              const status = ingredient.isImminent ? '임박' : ingredient.isOwned ? '보유' : '부족';

              return (
                <li className="bg-muted min-w-0 rounded-xl p-2" key={ingredient.id}>
                  <div className="bg-card text-muted-foreground grid aspect-square place-items-center rounded-lg">
                    <Package aria-hidden="true" className="size-6" strokeWidth={1.5} />
                  </div>
                  <p className="text-body-4 mt-2 truncate text-center font-semibold">
                    {ingredient.name}
                  </p>
                  <p className="text-label-4 text-muted-foreground mt-1 text-center">
                    {ingredient.amount}
                  </p>
                  <span className="bg-card text-label-4 mt-2 block rounded-full px-2 py-0.5 text-center">
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-7">
          <h2 className="text-title-4 font-semibold">조리 순서</h2>
          <ol className="mt-3 divide-y">
            {recipe.cookingSteps.map((step, index) => (
              <li className="py-4" key={step}>
                <p className="text-title-4 font-semibold">STEP {index + 1}</p>
                <p className="text-body-4 text-muted-foreground mt-2 leading-6">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <Link
          className="border-border text-foreground mt-4 flex h-12 items-center justify-center rounded-xl border text-sm font-semibold"
          href={`/recipe/${recipe.id}/complete`}
        >
          조리 완료 후 식재료 정리
        </Link>
      </div>
      <div className="px-4">
        <RecipeCartActions linkedProducts={recipe.linkedProducts} />
      </div>
    </main>
  );
}
