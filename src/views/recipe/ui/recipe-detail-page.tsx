import { Check, CircleAlert, Clock3, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import { getRecipeById } from '@/entities/recipe/model/mock';
import { Button } from '@/components/ui/button';
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
      <p className="text-muted-foreground mt-5 text-sm">{recipe.category}</p>
      <h2 className="mt-1 text-2xl font-semibold">{recipe.name}</h2>
      <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
        <Clock3 aria-hidden="true" className="size-4" />
        조리 시간 {recipe.cookTime}
      </div>
      <p className="mt-5 text-sm leading-6">{recipe.description}</p>
      <section className="mt-8">
        <h3 className="text-base font-semibold">팬트리에 있는 재료</h3>
        <ul className="mt-3 space-y-2">
          {owned.map((ingredient) => (
            <li
              className="bg-card flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
              key={ingredient.id}
            >
              <span className="flex items-center gap-2">
                <Check aria-hidden="true" className="text-primary size-4" />
                {ingredient.name}
                {ingredient.isImminent && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
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
        <h3 className="text-base font-semibold">부족한 재료 {missing.length}개</h3>
        <ul className="mt-3 space-y-2">
          {missing.map((ingredient) => (
            <li
              className="bg-card flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
              key={ingredient.id}
            >
              <span className="flex items-center gap-2">
                <CircleAlert aria-hidden="true" className="size-4 text-amber-600" />
                {ingredient.name}
              </span>
              <span className="text-muted-foreground">{ingredient.amount}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8 grid gap-2">
        <Button asChild className="h-12">
          <Link href={`/cart?from=recipe&recipe=${recipe.id}`}>
            <ShoppingCart aria-hidden="true" />
            부족한 재료 장바구니에 담기
          </Link>
        </Button>
        <Button asChild className="h-12" variant="outline">
          <Link href="/cooking/complete">이 레시피로 조리 완료</Link>
        </Button>
      </div>
    </MobileScreen>
  );
}
