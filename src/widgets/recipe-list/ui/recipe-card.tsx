import { ArrowRight, Clock3, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';

import type { Recipe } from '@/entities/recipe/model/types';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      aria-label={`${recipe.name} 레시피 보기`}
      className="bg-card hover:bg-muted block rounded-2xl border p-4 shadow-sm transition-colors"
      href={`/recipe/${recipe.id}`}
    >
      <div className="bg-muted text-muted-foreground flex h-32 items-center justify-center rounded-xl text-sm">
        레시피 이미지
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">{recipe.category}</p>
          <h2 className="mt-1 truncate text-base font-semibold">{recipe.name}</h2>
        </div>
        <ArrowRight aria-hidden="true" className="text-muted-foreground mt-1 size-4 shrink-0" />
      </div>
      <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1">
          <Clock3 aria-hidden="true" className="size-3" />
          {recipe.cookTime}
        </span>
        <span className="inline-flex items-center gap-1">
          <ShoppingBasket aria-hidden="true" className="size-3" />
          부족 {recipe.missingCount}개
        </span>
      </div>
    </Link>
  );
}
