'use client';

import { Check, ChevronLeft, CircleAlert, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { usePantryStore } from '@/entities/pantry/model/pantry-store';
import { getRecipeById } from '@/entities/recipe/model/mock';
import {
  toggleAllIngredients,
  toggleSelectedIngredient,
} from '@/features/cooking-complete/model/ingredient-selection';

interface CookingCompletePageProps {
  recipeId: string;
}

export function CookingCompletePage({ recipeId }: CookingCompletePageProps) {
  const router = useRouter();
  const recipe = getRecipeById(recipeId);
  const pantryItems = usePantryStore((state) => state.items);
  const removeItems = usePantryStore((state) => state.removeItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const recipeIngredientIds = new Set(
    recipe.ingredients
      .filter((ingredient) => ingredient.isOwned)
      .map((ingredient) => ingredient.id),
  );
  const ingredients = pantryItems.filter((item) => recipeIngredientIds.has(item.id));
  const ingredientIds = ingredients.map((ingredient) => ingredient.id);
  const isAllSelected =
    ingredientIds.length > 0 && ingredientIds.every((id) => selectedIds.includes(id));

  function handleConfirmDelete() {
    removeItems(selectedIds);
    router.push('/pantry');
  }

  return (
    <main className="bg-background text-foreground mx-auto min-h-dvh w-full max-w-[430px] px-4 pt-4 pb-10">
      <header className="flex h-12 items-center gap-2">
        <Link
          aria-label="레시피 상세로 돌아가기"
          className="grid size-10 place-items-center rounded-full"
          href={`/recipe/${recipe.id}`}
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </Link>
        <h1 className="text-xl font-semibold">조리 완료</h1>
      </header>

      <section className="mt-8">
        <p className="text-lg font-semibold">사용한 식재료를 선택해 주세요</p>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          선택한 식재료만 팬트리에서 삭제합니다. 정확한 수량은 자동으로 차감하지 않아요.
        </p>
      </section>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-base font-semibold">보유 식재료 {ingredients.length}개</h2>
        <button
          className="text-secondary-foreground text-sm font-semibold"
          onClick={() => setSelectedIds(toggleAllIngredients(ingredientIds, selectedIds))}
          type="button"
        >
          {isAllSelected ? '전체 선택 해제' : '전체 선택'}
        </button>
      </div>

      {ingredients.length === 0 ? (
        <section className="bg-muted mt-4 flex min-h-48 flex-col items-center justify-center rounded-2xl px-6 text-center">
          <CircleAlert aria-hidden="true" className="text-muted-foreground size-8" />
          <p className="mt-3 text-sm font-medium">삭제할 보유 식재료가 없어요.</p>
        </section>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {ingredients.map((ingredient) => {
            const isSelected = selectedIds.includes(ingredient.id);

            return (
              <li key={ingredient.id}>
                <button
                  aria-pressed={isSelected}
                  className={`relative flex min-h-40 w-full flex-col rounded-2xl border p-4 text-left ${isSelected ? 'border-secondary bg-accent' : 'border-border bg-card'}`}
                  onClick={() =>
                    setSelectedIds(toggleSelectedIngredient(selectedIds, ingredient.id))
                  }
                  type="button"
                >
                  <span
                    className={`grid size-6 place-items-center self-end rounded-full ${isSelected ? 'bg-secondary text-secondary-foreground' : 'border-border border text-transparent'}`}
                  >
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <span className="mt-4 text-base font-semibold">{ingredient.name}</span>
                  <span className="text-muted-foreground mt-2 text-xs">
                    {ingredient.expirationLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        className="bg-destructive text-destructive-foreground disabled:bg-muted disabled:text-muted-foreground mt-8 h-12 w-full rounded-xl text-sm font-semibold"
        disabled={selectedIds.length === 0}
        onClick={() => setIsConfirmOpen(true)}
        type="button"
      >
        선택한 식재료 삭제
      </button>

      {isConfirmOpen && (
        <div
          className="bg-overlay/40 fixed inset-0 z-30 flex items-center justify-center px-4"
          role="presentation"
        >
          <section
            aria-label="식재료 삭제 확인"
            aria-modal="true"
            className="bg-card w-full max-w-[360px] rounded-3xl p-5"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">정말 삭제할까요?</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-5">
                  삭제한 식재료는 팬트리에서 사라집니다.
                </p>
              </div>
              <button
                aria-label="삭제 확인 닫기"
                className="grid size-10 place-items-center rounded-full"
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <ul className="mt-5 max-h-[32dvh] space-y-2 overflow-y-auto pr-1">
              {ingredients
                .filter((ingredient) => selectedIds.includes(ingredient.id))
                .map((ingredient) => (
                  <li
                    className="bg-muted rounded-xl px-4 py-3 text-sm font-medium"
                    key={ingredient.id}
                  >
                    {ingredient.name}
                  </li>
                ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="border-border h-11 rounded-xl border text-sm font-semibold"
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="bg-destructive text-destructive-foreground h-11 rounded-xl text-sm font-semibold"
                onClick={handleConfirmDelete}
                type="button"
              >
                삭제하기
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
