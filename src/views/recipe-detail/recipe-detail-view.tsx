import { ArrowLeft, ChefHat, Heart } from 'lucide-react';
import Link from 'next/link';

import { RecipeCartActions } from '@/features/recipe-cart/ui/recipe-cart-actions';

type IngredientStatus = '보유' | '부족' | '임박';

type Ingredient = {
  name: string;
  detail: string;
  status: IngredientStatus;
};

const ingredients: Ingredient[] = [
  { name: '떡볶이 떡', detail: '1봉', status: '보유' },
  { name: '모짜렐라 치즈', detail: '100g', status: '부족' },
  { name: '대파', detail: '1/2대', status: '임박' },
];

const steps = [
  '팬에 물과 떡볶이 소스를 넣고 끓여 주세요.',
  '떡과 어묵을 넣고 양념이 배도록 졸여 주세요.',
  '치즈를 올린 뒤 뚜껑을 덮어 녹여 주세요.',
  '대파를 올려 완성해 주세요.',
];

const statusClassName: Record<IngredientStatus, string> = {
  보유: 'bg-[#e7f5e1] text-[#397b32]',
  부족: 'bg-[#f3f4f5] text-[#68696d]',
  임박: 'bg-[#fff1d6] text-[#a65b00]',
};

export function RecipeDetailView() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white pb-24 text-[#131313]">
      <section aria-label="레시피 대표 이미지" className="relative h-[219px] bg-[#c5c6c9]">
        <Link
          aria-label="이전 페이지로 이동"
          className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-white/80 text-[#131313] backdrop-blur-sm"
          href="/"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <div className="absolute inset-0 grid place-items-center text-[#8e9094]">
          <ChefHat className="size-11" aria-hidden="true" strokeWidth={1.5} />
          <span className="sr-only">치즈 떡볶이 대표 이미지</span>
        </div>
      </section>

      <section className="relative px-4 pt-4">
        <div className="pr-20">
          <h1 className="text-xl leading-7 font-bold">치즈 떡볶이</h1>
          <p className="mt-2 text-sm leading-5 font-medium">분식 · 약 15분</p>
        </div>
        <div className="absolute top-3 right-4 flex gap-1">
          <button
            aria-label="레시피 찜하기"
            className="grid size-10 place-items-center rounded-full"
            type="button"
          >
            <Heart className="size-6" aria-hidden="true" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-1">
          <span className="rounded-full bg-[#e7f5e1] px-2 py-1 text-sm leading-5 font-medium text-[#397b32]">
            전체 보유
          </span>
          <span className="rounded-full bg-[#f3f4f5] px-2 py-1 text-sm leading-5 font-medium text-[#68696d]">
            일부 보유
          </span>
          <span className="rounded-full bg-[#fff1d6] px-2 py-1 text-sm leading-5 font-medium text-[#a65b00]">
            기한 임박
          </span>
          <span className="rounded-full bg-[#f3f4f5] px-2 py-1 text-sm leading-5 font-medium text-[#68696d]">
            식재료 없음
          </span>
        </div>
      </section>

      <section className="px-4 pt-8" aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading" className="text-base leading-[22px] font-semibold">
          보유 식재료
        </h2>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {ingredients.map((ingredient) => (
            <li key={ingredient.name} className="relative rounded-lg bg-[#dddee2] p-2 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-lg bg-[#c5c6c9] text-[#8e9094]">
                <ChefHat className="size-7" aria-hidden="true" strokeWidth={1.5} />
              </div>
              <p className="mt-3 truncate text-sm leading-5 font-semibold">{ingredient.name}</p>
              <p className="mt-1 text-xs leading-4 text-[#68696d]">{ingredient.detail}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs leading-4 font-medium ${statusClassName[ingredient.status]}`}
              >
                {ingredient.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-8" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-base leading-[22px] font-semibold">
          조리 순서
        </h2>
        <ol className="mt-2 divide-y divide-[#e9e9eb]">
          {steps.map((step, index) => (
            <li key={step} className="py-4">
              <p className="text-base leading-[22px] font-semibold">STEP {index + 1}</p>
              <p className="mt-2 text-sm leading-5 text-[#5d5e63]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <RecipeCartActions />
    </main>
  );
}
