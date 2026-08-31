'use client';

import { ArrowLeft, Image as ImageIcon, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ingredientMocks = [
  { id: 'egg', name: '계란', category: '축산물', quantity: '2개' },
  { id: 'potato', name: '감자', category: '채소', quantity: '2개' },
  { id: 'green-onion', name: '대파', category: '채소', quantity: '1대' },
  { id: 'tofu', name: '두부', category: '가공식품', quantity: '1모' },
  { id: 'pork', name: '돼지고기', category: '축산물', quantity: '200g' },
  { id: 'carrot', name: '당근', category: '채소', quantity: '1개' },
  { id: 'mushroom', name: '버섯', category: '채소', quantity: '100g' },
  { id: 'kimchi', name: '김치', category: '반찬', quantity: '200g' },
  { id: 'milk', name: '우유', category: '유제품', quantity: '1팩' },
];

export function IngredientSelectionPage() {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);

  function toggleIngredient(ingredientId: string) {
    setSelectedIngredientIds((currentIds) =>
      currentIds.includes(ingredientId)
        ? currentIds.filter((id) => id !== ingredientId)
        : [...currentIds, ingredientId],
    );
  }

  return (
    <main className="bg-background text-foreground mx-auto min-h-dvh w-full max-w-[390px] pb-8">
      <header className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            aria-label="주재료 레시피로 돌아가기"
            className="flex size-10 items-center justify-center"
            href="/recipe"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Link>
          <div aria-hidden="true" className="h-8 w-[180px] rounded-full bg-[#949497]" />
        </div>
        <button
          aria-label="재료 검색"
          className="flex size-10 items-center justify-center"
          type="button"
        >
          <Search aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="mt-6 flex [scrollbar-width:none] gap-1 overflow-x-auto px-4">
        {['카테고리', '팬트리 재료', '유형 구분'].map((filter) => (
          <button
            className="text-label-3 h-[34px] shrink-0 rounded-full bg-[#c5c6c9] px-6 font-medium"
            key={filter}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      <section aria-label="선택할 식재료" className="mt-4 grid grid-cols-3 gap-2 px-4">
        {ingredientMocks.map((ingredient) => {
          const isSelected = selectedIngredientIds.includes(ingredient.id);

          return (
            <button
              aria-pressed={isSelected}
              className={`relative flex h-[136px] flex-col items-center justify-center rounded-lg p-2 text-center transition-colors ${
                isSelected ? 'bg-[#eff0f4] ring-2 ring-[#949497]' : 'bg-card'
              }`}
              key={ingredient.id}
              onClick={() => toggleIngredient(ingredient.id)}
              type="button"
            >
              <span
                aria-label={isSelected ? `${ingredient.name} 선택 취소` : `${ingredient.name} 선택`}
                className="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#c5c6c9]"
              >
                <Plus
                  aria-hidden="true"
                  className={`size-4 transition-transform ${isSelected ? 'rotate-45' : ''}`}
                />
              </span>
              <span className="flex size-20 items-center justify-center rounded-lg bg-[#c5c6c9] text-[#949497]">
                <ImageIcon aria-hidden="true" className="size-5" />
              </span>
              <strong className="text-body-4 mt-1 font-medium">{ingredient.name}</strong>
              <span className="text-label-4 mt-1 flex gap-1">
                <span className="rounded-full bg-[#c5c6c9] px-2 py-0.5">{ingredient.category}</span>
                <span className="rounded-full bg-[#c5c6c9] px-2 py-0.5">{ingredient.quantity}</span>
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
