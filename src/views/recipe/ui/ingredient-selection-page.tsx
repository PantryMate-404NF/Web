'use client';

import { ArrowLeft, Check, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useRecipeFilterIngredientsQuery } from '@/entities/recipe/api/use-recipe-filter-ingredients-query';
import { SystemErrorState } from '@/shared/ui/system-error-state';

const MAX_SELECTED_INGREDIENTS = 3;

export function IngredientSelectionPage() {
  const { data: ingredients, error, isPending, refetch } = useRecipeFilterIngredientsQuery();
  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);
  const defaultIds = useMemo(
    () =>
      ingredients?.filter((item) => item.defaultSelected).map((item) => item.ingredientId) ?? [],
    [ingredients],
  );

  const activeSelectedIds = selectedIds ?? defaultIds.slice(0, MAX_SELECTED_INGREDIENTS);

  function toggleIngredient(id: number) {
    setSelectedIds((currentSelection) => {
      const current = currentSelection ?? defaultIds.slice(0, MAX_SELECTED_INGREDIENTS);
      if (current.includes(id)) return current.filter((selectedId) => selectedId !== id);
      return current.length >= MAX_SELECTED_INGREDIENTS ? current : [...current, id];
    });
  }

  const search = new URLSearchParams();
  activeSelectedIds.forEach((id) => search.append('ingredientIds', String(id)));
  const recipeHref = `/recipe?${search.toString()}`;

  return (
    <main className="mobile-page bg-background text-foreground min-h-dvh pb-8">
      <header className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            aria-label="레시피로 돌아가기"
            className="grid size-10 place-items-center"
            href="/recipe"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Link>
          <h1 className="text-base font-semibold">재료 선택</h1>
        </div>
        <Link
          aria-label="선택 완료"
          className="grid size-10 place-items-center rounded-full bg-[var(--primitive-primary-500)]"
          href={recipeHref}
        >
          <Check aria-hidden="true" className="size-5" />
        </Link>
      </header>

      <p className="px-4 py-3 text-sm text-[var(--primitive-grey-500)]">
        팬트리 재료를 최대 {MAX_SELECTED_INGREDIENTS}개 선택해 레시피를 찾아보세요.
      </p>

      {error ? (
        <SystemErrorState onRetry={() => void refetch()} title="팬트리 재료를 불러오지 못했어요" />
      ) : isPending ? (
        <div className="py-16 text-center" role="status">
          <span className="sr-only">팬트리 재료를 불러오는 중입니다.</span>
        </div>
      ) : ingredients?.length ? (
        <section aria-label="선택할 팬트리 재료" className="grid grid-cols-2 gap-3 px-4">
          {ingredients.map((ingredient) => {
            const selected = activeSelectedIds.includes(ingredient.ingredientId);
            const disabled = !selected && activeSelectedIds.length >= MAX_SELECTED_INGREDIENTS;
            return (
              <button
                aria-pressed={selected}
                className={`flex min-h-24 items-center justify-between rounded-xl border p-4 text-left ${
                  selected
                    ? 'border-[var(--primitive-primary-500)] bg-[var(--primitive-primary-100)]'
                    : 'bg-card border-[var(--primitive-grey-200)]'
                }`}
                disabled={disabled}
                key={ingredient.ingredientId}
                onClick={() => toggleIngredient(ingredient.ingredientId)}
                type="button"
              >
                <span>
                  <strong className="block text-sm font-semibold">{ingredient.name}</strong>
                  <span className="mt-1 block text-xs text-[var(--primitive-grey-500)]">
                    {ingredient.expired ? '소비기한 경과' : `소비기한 ${ingredient.expiryDate}`}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="bg-card grid size-8 place-items-center rounded-full"
                >
                  {selected ? <Check className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            );
          })}
        </section>
      ) : (
        <section className="px-4 py-12 text-center" aria-label="선택 가능한 재료 없음">
          <p className="text-sm text-[var(--primitive-grey-500)]">
            선택할 수 있는 팬트리 재료가 없어요.
          </p>
        </section>
      )}
    </main>
  );
}
