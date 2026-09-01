import { ChefHat, ChevronRight, Clock3, Heart, Package } from 'lucide-react';
import Link from 'next/link';

import { getRecipeById } from '@/entities/recipe/model/mock';
import { RecipeCartActions } from '@/features/recipe-cart/ui/recipe-cart-actions';
import { MobileScreen } from '@/widgets/app-shell/ui/mobile-screen';

interface RecipeDetailPageProps {
  recipeId: string;
}

export function RecipeDetailPage({ recipeId }: RecipeDetailPageProps) {
  const recipe = getRecipeById(recipeId);
  const owned = recipe.ingredients.filter((ingredient) => ingredient.isOwned);
  const missing = recipe.ingredients.filter((ingredient) => !ingredient.isOwned);
  const statusChips = [
    owned.length === recipe.ingredients.length ? '전체 보유' : '일부 보유',
    owned.some((ingredient) => ingredient.isImminent) ? '기한 임박' : null,
    missing.length > 0 ? `식재료 ${missing.length}개 부족` : null,
  ].filter(Boolean);

  return (
    <MobileScreen backHref="/recipe" title="레시피 상세">
      <div className="bg-muted text-muted-foreground mt-5 flex h-[219px] items-center justify-center rounded-2xl">
        <ChefHat aria-hidden="true" className="size-10" strokeWidth={1.5} />
      </div>
      <section className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-2 font-semibold">{recipe.name}</h2>
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
            className="border-border grid size-10 shrink-0 place-items-center rounded-full border"
            type="button"
          >
            <Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />
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
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-title-4 font-semibold">보유 식재료</h3>
          <span className="text-label-4 text-muted-foreground">{owned.length}개</span>
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {owned.map((ingredient) => (
            <li className="bg-muted min-w-0 rounded-xl p-2" key={ingredient.id}>
              <div className="bg-card text-muted-foreground grid aspect-square place-items-center rounded-lg">
                <Package aria-hidden="true" className="size-6" strokeWidth={1.5} />
              </div>
              <p className="text-body-4 mt-2 truncate font-semibold">{ingredient.name}</p>
              <p className="text-label-4 text-muted-foreground mt-1">{ingredient.amount}</p>
              {ingredient.isImminent && (
                <span className="bg-secondary text-secondary-foreground text-label-4 mt-2 inline-flex rounded-full px-2 py-0.5">
                  임박
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="text-title-4 font-semibold">조리 순서</h3>
        <ol className="mt-2 divide-y">
          {recipe.cookingSteps.map((step, index) => (
            <li className="py-4" key={step}>
              <p className="text-title-4 font-semibold">STEP {index + 1}</p>
              <p className="text-body-4 text-muted-foreground mt-2 leading-6">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Link
        className="border-border text-foreground mt-4 flex h-12 items-center justify-center gap-1 rounded-xl border text-sm font-semibold"
        href={`/recipe/${recipe.id}/complete`}
      >
        조리 완료 후 식재료 정리
        <ChevronRight aria-hidden="true" className="size-4" />
      </Link>
      <div className="pb-24">
        <RecipeCartActions linkedProducts={recipe.linkedProducts} />
      </div>
    </MobileScreen>
  );
}
