import { Check, CircleAlert, Clock3 } from 'lucide-react';
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

  return (
    <MobileScreen backHref="/recipe" title="레시피 상세">
      <div className="bg-muted text-muted-foreground mt-5 flex h-52 items-center justify-center rounded-3xl">
        레시피 대표 이미지
      </div>
      <p className="text-label-3 text-muted-foreground mt-5">{recipe.category}</p>
      <h2 className="text-heading-2 mt-1 font-semibold">{recipe.name}</h2>
      <div className="text-body-4 text-muted-foreground mt-3 flex items-center gap-2">
        <Clock3 aria-hidden="true" className="size-4" />
        조리 시간 {recipe.cookTime}
      </div>
      <p className="text-body-4 mt-5">{recipe.description}</p>
      <section className="mt-8">
        <h3 className="text-title-4 font-semibold">팬트리에 있는 재료</h3>
        <ul className="mt-3 space-y-2">
          {owned.map((ingredient) => (
            <li
              className="bg-card text-body-4 flex items-center justify-between rounded-xl border px-4 py-3"
              key={ingredient.id}
            >
              <span className="flex items-center gap-2">
                <Check aria-hidden="true" className="text-primary size-4" />
                {ingredient.name}
                {ingredient.isImminent && (
                  <span className="bg-secondary text-secondary-foreground text-label-4 rounded-full px-2 py-0.5">
                    먼저 사용
                  </span>
                )}
              </span>
              <span className="text-muted-foreground">{ingredient.amount}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h3 className="text-title-4 font-semibold">부족한 재료 {missing.length}개</h3>
        <ul className="mt-3 space-y-2">
          {missing.map((ingredient) => (
            <li
              className="bg-card text-body-4 flex items-center justify-between rounded-xl border px-4 py-3"
              key={ingredient.id}
            >
              <span className="flex items-center gap-2">
                <CircleAlert aria-hidden="true" className="text-secondary size-4" />
                {ingredient.name}
              </span>
              <span className="text-muted-foreground">{ingredient.amount}</span>
            </li>
          ))}
        </ul>
      </section>
      <Link
        className="bg-primary text-primary-foreground mt-8 flex h-12 items-center justify-center rounded-xl text-sm font-semibold"
        href={`/recipe/${recipe.id}/complete`}
      >
        조리 완료
      </Link>
      <RecipeCartActions linkedProducts={recipe.linkedProducts} />
    </MobileScreen>
  );
}
