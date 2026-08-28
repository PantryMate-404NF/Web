import { Sparkles } from 'lucide-react';
import Link from 'next/link';

import { recipeMocks } from '@/entities/recipe/model/mock';
import type { RecipeTab } from '@/entities/recipe/model/types';
import { MobileScreen } from '@/widgets/app-shell/ui/mobile-screen';
import { RecipeCard } from '@/widgets/recipe-list/ui/recipe-card';

interface RecipeListPageProps {
  tab: RecipeTab;
}

export function getRecipeTab(value?: string): RecipeTab {
  return value === 'imminent' ? 'imminent' : 'main';
}

export function RecipeListPage({ tab }: RecipeListPageProps) {
  const recipes =
    tab === 'imminent'
      ? recipeMocks.filter((recipe) => recipe.ingredients.some((item) => item.isImminent))
      : recipeMocks;

  return (
    <MobileScreen
      action={
        <Link className="text-primary text-sm font-medium" href="/pantry?state=full">
          팬트리
        </Link>
      }
      title="레시피"
    >
      <section className="bg-muted mt-5 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="text-primary size-4" />
          <p className="text-sm font-medium">팬트리 재료를 활용한 추천이에요</p>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          지금 만들 수 있는 메뉴와 재료 1~2개만 더 있으면 되는 메뉴를 보여드려요.
        </p>
      </section>
      <div
        aria-label="레시피 분류"
        className="mt-6 grid grid-cols-2 rounded-xl border p-1"
        role="tablist"
      >
        <Link
          aria-selected={tab === 'main'}
          className={`rounded-lg py-2.5 text-center text-sm font-medium ${tab === 'main' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          href="/recipe?tab=main"
          role="tab"
        >
          주재료 레시피
        </Link>
        <Link
          aria-selected={tab === 'imminent'}
          className={`rounded-lg py-2.5 text-center text-sm font-medium ${tab === 'imminent' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          href="/recipe?tab=imminent"
          role="tab"
        >
          소비기한 임박
        </Link>
      </div>
      <section className="mt-6">
        <h2 className="text-base font-semibold">
          {tab === 'imminent' ? '먼저 활용하면 좋은 메뉴' : '지금 추천하는 메뉴'}
        </h2>
        <div className="mt-3 grid gap-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </MobileScreen>
  );
}
