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
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-4 pt-4 pb-10 text-[#131313]">
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
        <p className="mt-2 text-sm leading-6 text-[#68696d]">
          선택한 식재료만 팬트리에서 삭제합니다. 정확한 수량은 자동으로 차감하지 않아요.
        </p>
      </section>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-base font-semibold">보유 식재료 {ingredients.length}개</h2>
        <button
          className="text-sm font-semibold text-[#397b32]"
          onClick={() => setSelectedIds(toggleAllIngredients(ingredientIds, selectedIds))}
          type="button"
        >
          {isAllSelected ? '전체 선택 해제' : '전체 선택'}
        </button>
      </div>

      {ingredients.length === 0 ? (
        <section className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-2xl bg-[#f3f4f5] px-6 text-center">
          <CircleAlert aria-hidden="true" className="size-8 text-[#949497]" />
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
                  className={`relative flex min-h-40 w-full flex-col rounded-2xl border p-4 text-left ${isSelected ? 'border-[#6baa62] bg-[#edf7e9]' : 'border-[#e9e9eb] bg-white'}`}
                  onClick={() =>
                    setSelectedIds(toggleSelectedIngredient(selectedIds, ingredient.id))
                  }
                  type="button"
                >
                  <span
                    className={`grid size-6 place-items-center self-end rounded-full ${isSelected ? 'bg-[#6baa62] text-white' : 'border border-[#c5c6c9] text-transparent'}`}
                  >
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <span className="mt-4 text-base font-semibold">{ingredient.name}</span>
                  <span className="mt-2 text-xs text-[#68696d]">{ingredient.expirationLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        className="mt-8 h-12 w-full rounded-xl bg-[#6f6f71] text-sm font-semibold text-white disabled:bg-[#dddee2] disabled:text-[#949497]"
        disabled={selectedIds.length === 0}
        onClick={() => setIsConfirmOpen(true)}
        type="button"
      >
        선택한 식재료 삭제
      </button>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4"
          role="presentation"
        >
          <section
            aria-label="식재료 삭제 확인"
            aria-modal="true"
            className="w-full max-w-[360px] rounded-3xl bg-white p-5"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">정말 삭제할까요?</h2>
                <p className="mt-2 text-sm leading-5 text-[#68696d]">
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
                    className="rounded-xl bg-[#f3f4f5] px-4 py-3 text-sm font-medium"
                    key={ingredient.id}
                  >
                    {ingredient.name}
                  </li>
                ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="h-11 rounded-xl border border-[#dddee2] text-sm font-semibold"
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="h-11 rounded-xl bg-[#6f6f71] text-sm font-semibold text-white"
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
