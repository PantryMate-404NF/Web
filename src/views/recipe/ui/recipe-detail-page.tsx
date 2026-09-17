'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Bookmark, Check, Share } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getCartItemCount, type CartProduct, useCartStore } from '@/entities/cart/model/cart-store';
import type { PantryDto } from '@/entities/pantry/api/pantry.dto';
import { usePantryStore } from '@/entities/pantry/model/pantry-store';
import type { PantryItem } from '@/entities/pantry/model/types';
import { PANTRY_QUERY_KEY } from '@/entities/pantry/api/use-pantries-query';

interface RecipeDetailPageProps {
  recipeId: string;
}

type IngredientStatus = 'available' | 'imminent' | 'unavailable';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  imageSrc: string;
  status: IngredientStatus;
  statusLabel: string;
}

interface CleanupIngredient {
  id: string;
  imageSrc: string;
  name: string;
}

type CleanupToast = {
  message: string;
  type: 'incomplete' | 'success';
};

const mockCartPriceByIngredientId: Record<string, number> = {
  tomato: 3900,
  egg: 5900,
  ketchup: 3200,
  sugar: 2800,
  'green-onion': 1900,
  'cooking-oil': 6900,
};

const recipeDetailImage = (fileName: string) => `/images/recipe-detail/${fileName}`;

export const COOKING_GUIDE_DELAY_MS = 60 * 1000;
export const COOKING_GUIDE_VISIBLE_MS = 10 * 1000;

const ingredients: Ingredient[] = [
  {
    id: 'tomato',
    name: '토마토',
    amount: '2개 (400g)',
    imageSrc: recipeDetailImage('tomato.png'),
    status: 'imminent',
    statusLabel: '보유 · D-1',
  },
  {
    id: 'egg',
    name: '달걀',
    amount: '3개 (180g)',
    imageSrc: recipeDetailImage('egg.png'),
    status: 'unavailable',
    statusLabel: '미보유',
  },
  {
    id: 'ketchup',
    name: '케첩',
    amount: '2큰술',
    imageSrc: recipeDetailImage('ketchup.png'),
    status: 'unavailable',
    statusLabel: '미보유',
  },
  {
    id: 'sugar',
    name: '설탕',
    amount: '1작은술',
    imageSrc: recipeDetailImage('sugar.png'),
    status: 'available',
    statusLabel: '보유',
  },
  {
    id: 'green-onion',
    name: '대파',
    amount: '1/2대',
    imageSrc: recipeDetailImage('green-onion.png'),
    status: 'available',
    statusLabel: '보유',
  },
  {
    id: 'cooking-oil',
    name: '식용유',
    amount: '3큰술',
    imageSrc: recipeDetailImage('cooking-oil.png'),
    status: 'available',
    statusLabel: '보유',
  },
];

const steps = [
  {
    description: '양념 재료(케찹, 설탕)를 섞어 양념을 만들어 주세요.',
    tips: '입맛에 맞게 소금간을 하거나, 건강을 위한다면 저당 케찹과 대체당을 사용해도 좋아요.',
    number: 'STEP 1',
  },
  {
    description:
      '토마토는 꼭지를 제거하고, 꼭지 반대편에 십자모양으로 칼집을 내 주세요. 센불의 끓는 물에 토마토를 넣고 1~2분간 살짝 데친 후 건져 껍질을 제거해 주세요.​',
    tips: '입맛에 맞게 소금간을 하거나, 건강을 위한다면 저당 케찹과 대체당을 사용해도 좋아요.',
    number: 'STEP 2',
  },
  {
    description:
      '토마토 가로로 반을 자른 후, 십자 모양으로 잘라 8등분해 주세요. 대파는 세로로 반 갈라 송송 썰어 준비해 주세요.',
    tips: '토마토 손질 시, 토마토의 씨와 과육을 제거하면 수분이 감소해 조금 더 깔끔한 토달볶을 완성할 수 있어요.',
    number: 'STEP 3',
  },
  {
    description:
      '달걀은 불에 잘 풀어주세요. 중불로 1분간 예열한 팬에 식용유(2스푼)을 두른 후, 달걀물을 부어 저어가며 몽글몽글하게 스크램블에그로 1~2분간 익힌 후, 팬에서 빼 주세요.',
    tips: '천천히 저어가며 익혀주세요. 몽글몽글한 덩어리가 생기고, 촉촉한 상태가 되면 스크램블에그 완성!',
    number: 'STEP 4',
  },
  {
    description:
      '열기가 남아 있는 동안 동일한 팬에 식용유(3스푼)를 두르고 센불에 대파를 넣어 1분간 볶아주세요. 대파 향이 올라오면 준비한 토마토를 넣어 센불에서 1분 볶아 주세요.',
    number: 'STEP 5',
  },
  {
    description:
      '중불로 줄인 후, 토마토 위에 양념과 볶아둔 달걀을 넣어 골고루 양념이 묻어나도록 1분간 볶아주면 완성!',
    number: 'STEP 6',
  },
];

const statusClassName: Record<IngredientStatus, string> = {
  available: 'bg-[var(--primitive-secondary-100)] text-[var(--primitive-secondary-800)]',
  imminent: 'bg-[var(--primitive-warning-100)] text-[var(--primitive-warning-500)]',
  unavailable: 'bg-[var(--primitive-error-100)] text-[var(--primitive-error-500)]',
};

export function toggleIngredientSelection(selectedIds: string[], ingredientId: string) {
  return selectedIds.includes(ingredientId)
    ? selectedIds.filter((id) => id !== ingredientId)
    : [...selectedIds, ingredientId];
}

export function areAllIngredientsSelected(selectedIds: string[], ingredientIds: string[]) {
  return ingredientIds.length > 0 && ingredientIds.every((id) => selectedIds.includes(id));
}

export function getCleanupIngredients(items: Ingredient[]): CleanupIngredient[] {
  return items.map(({ id, imageSrc, name }) => ({ id, imageSrc, name }));
}

export function getMatchingPantryIngredients(
  recipeIngredients: Array<Pick<Ingredient, 'imageSrc' | 'name'>>,
  pantryItems: Array<Pick<PantryItem, 'id' | 'imageAlt' | 'imageUrl' | 'name'>>,
): CleanupIngredient[] {
  const recipeImageByName = new Map(
    recipeIngredients.map((ingredient) => [ingredient.name, ingredient.imageSrc]),
  );

  return pantryItems.flatMap((pantryItem) => {
    const fallbackImageSrc = recipeImageByName.get(pantryItem.name);
    if (!fallbackImageSrc) return [];

    return [
      {
        id: pantryItem.id,
        imageSrc: pantryItem.imageUrl ?? fallbackImageSrc,
        name: pantryItem.name,
      },
    ];
  });
}

export function getCleanupToastMessage(count: number) {
  return `총 ${count}개의 식재료가 삭제되었어요.`;
}

export function getCleanupDeletionCount(selectedIngredientIds: string[]) {
  return selectedIngredientIds.length;
}

/** 현재 목업 필요 재료를 장바구니 표시용 임시 상품으로 변환함 */
export function toRecipeCartProducts(
  recipeId: string,
  sourceIngredients: Ingredient[],
): CartProduct[] {
  return sourceIngredients.map((ingredient) => ({
    id: `${recipeId}-${ingredient.id}`,
    ingredient: ingredient.name,
    name: `${ingredient.name} 상품`,
    price: mockCartPriceByIngredientId[ingredient.id] ?? 0,
  }));
}

export function RecipeDetailPage({ recipeId }: RecipeDetailPageProps) {
  const queryClient = useQueryClient();
  const pantryItems = usePantryStore((state) => state.items);
  const removePantryItems = usePantryStore((state) => state.removeItems);
  const cartItems = useCartStore((state) => state.items);
  const addProducts = useCartStore((state) => state.addProducts);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [selectedUsedIngredientIds, setSelectedUsedIngredientIds] = useState<string[]>([]);
  const [isCleanupSheetOpen, setIsCleanupSheetOpen] = useState(false);
  const [cleanupToast, setCleanupToast] = useState<CleanupToast | null>(null);
  const [isCookingGuideVisible, setIsCookingGuideVisible] = useState(false);
  const stepsSectionRef = useRef<HTMLElement>(null);
  const hasStartedCookingGuideTimerRef = useRef(false);
  const cleanupToastTimerRef = useRef<number | undefined>(undefined);
  const hasSelectedIngredient = selectedIngredientIds.length > 0;
  const cleanupIngredients = getCleanupIngredients(ingredients);
  const cartItemCount = getCartItemCount(cartItems);

  useEffect(() => {
    const stepsSection = stepsSectionRef.current;
    if (!stepsSection) return;

    let hideTimer: number | undefined;
    let showTimer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedCookingGuideTimerRef.current) return;

        hasStartedCookingGuideTimerRef.current = true;
        showTimer = window.setTimeout(() => {
          setIsCookingGuideVisible(true);
          hideTimer = window.setTimeout(() => {
            setIsCookingGuideVisible(false);
          }, COOKING_GUIDE_VISIBLE_MS);
        }, COOKING_GUIDE_DELAY_MS);
        observer.disconnect();
      },
      { threshold: 0.01 },
    );

    observer.observe(stepsSection);

    return () => {
      observer.disconnect();
      if (showTimer !== undefined) window.clearTimeout(showTimer);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(
    () => () => {
      if (cleanupToastTimerRef.current !== undefined) {
        window.clearTimeout(cleanupToastTimerRef.current);
      }
    },
    [],
  );

  const handleIngredientClick = (ingredientId: string) => {
    setSelectedIngredientIds((selectedIds) => toggleIngredientSelection(selectedIds, ingredientId));
  };

  const handleAddSelectedIngredients = () => {
    addProducts(
      toRecipeCartProducts(
        recipeId,
        ingredients.filter((ingredient) => selectedIngredientIds.includes(ingredient.id)),
      ),
    );
  };

  const handleAddAllIngredients = () => {
    addProducts(toRecipeCartProducts(recipeId, ingredients));
  };

  const handleUsedIngredientClick = (ingredientId: string) => {
    setSelectedUsedIngredientIds((selectedIds) =>
      toggleIngredientSelection(selectedIds, ingredientId),
    );
  };

  const showCleanupToast = (nextToast: CleanupToast) => {
    setCleanupToast(nextToast);
    if (cleanupToastTimerRef.current !== undefined) {
      window.clearTimeout(cleanupToastTimerRef.current);
    }
    cleanupToastTimerRef.current = window.setTimeout(() => {
      setCleanupToast(null);
    }, COOKING_GUIDE_VISIBLE_MS);
  };

  const handleCookingComplete = () => {
    setSelectedUsedIngredientIds([]);
    setIsCleanupSheetOpen(true);
  };

  const handleCleanupDismiss = () => {
    setIsCleanupSheetOpen(false);
    showCleanupToast({
      message: `'토마토 달걀 볶음'에 사용한 식재료가 팬트리에 반영되지 않았어요.`,
      type: 'incomplete',
    });
  };

  const handleCleanupComplete = () => {
    const selectedIngredientNames = new Set(
      ingredients
        .filter((ingredient) => selectedUsedIngredientIds.includes(ingredient.id))
        .map((ingredient) => ingredient.name),
    );
    const selectedPantryItemIds = pantryItems
      .filter((item) => selectedIngredientNames.has(item.name))
      .map((item) => item.id);

    if (selectedPantryItemIds.length > 0) {
      const selectedIdSet = new Set(selectedPantryItemIds);
      removePantryItems(selectedPantryItemIds);
      queryClient.setQueryData<PantryDto[]>(PANTRY_QUERY_KEY, (cachedItems) =>
        cachedItems?.filter((item) => !selectedIdSet.has(String(item.pantryId))),
      );
    }

    setIsCleanupSheetOpen(false);
    showCleanupToast({
      message: getCleanupToastMessage(getCleanupDeletionCount(selectedUsedIngredientIds)),
      type: 'success',
    });
  };

  return (
    <main
      className="mobile-page bg-[var(--background-primary)] pb-10 text-[var(--text-primary)]"
      data-recipe-id={recipeId}
    >
      <section className="relative h-[219px] overflow-hidden">
        <Image
          alt="토마토 달걀 볶음"
          className="object-cover object-[center_60%]"
          fill
          priority
          sizes="(max-width: 390px) 100vw, 390px"
          src={recipeDetailImage('tomato-egg-hero.png')}
          unoptimized
        />
      </section>

      <div className="mobile-page--padded">
        <section className="relative py-4">
          <h1 className="text-title-2 pr-24 font-semibold">토마토 달걀 볶음</h1>
          <p className="text-body-4 mt-1 font-medium text-[var(--primitive-grey-600)]">
            중식 · 20분
          </p>
          <div className="absolute top-2 right-0 flex items-center gap-0.5">
            <button
              aria-label="레시피 공유"
              className="grid size-10 place-items-center text-[var(--primitive-grey-700)]"
              type="button"
            >
              <Share size={24} strokeWidth={1.5} />
            </button>
            <button
              aria-label="레시피 저장"
              className="grid size-10 place-items-center text-[var(--primitive-grey-700)]"
              type="button"
            >
              <Bookmark size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-label-4 rounded-full bg-[var(--primitive-secondary-300)] px-3 py-1 font-semibold text-[var(--primitive-secondary-800)]">
              일부 보유
            </span>
            <span className="text-label-4 rounded-full bg-[var(--primitive-warning-100)] px-3 py-1 font-semibold text-[var(--primitive-warning-500)]">
              기한 임박
            </span>
          </div>
        </section>

        <section
          className="border-t border-[var(--border-subtle)] py-4"
          aria-labelledby="ingredients-heading"
        >
          <h2 className="text-title-4 font-semibold" id="ingredients-heading">
            필요 재료
          </h2>
          <ul className="mt-4 grid grid-cols-3 justify-items-center gap-2">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <button
                  aria-label={`${ingredient.name} ${ingredient.statusLabel} 선택`}
                  aria-pressed={selectedIngredientIds.includes(ingredient.id)}
                  className="relative flex h-44 w-28 flex-col items-center justify-center rounded-xl border-[1px] bg-[var(--surface-default)] px-3 text-left transition-[border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.98]"
                  onClick={() => handleIngredientClick(ingredient.id)}
                  style={{
                    borderColor: selectedIngredientIds.includes(ingredient.id)
                      ? 'var(--primitive-primary-500)'
                      : 'var(--primitive-grey-300)',
                  }}
                  type="button"
                >
                  <div className="relative flex flex-col items-center gap-1 self-stretch">
                    {hasSelectedIngredient ? (
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 -right-[12.5px] z-10 grid size-10 place-items-center"
                      >
                        <span
                          className={`grid size-6 place-items-center rounded-full transition-colors duration-200 ${
                            selectedIngredientIds.includes(ingredient.id)
                              ? 'bg-[var(--primitive-primary-400)] text-[var(--primitive-grey-800)]'
                              : 'bg-[var(--primitive-grey-100)] text-[var(--primitive-grey-400)]'
                          }`}
                        >
                          <Check size={18} strokeWidth={2} />
                        </span>
                      </span>
                    ) : null}
                    <div className="relative size-20 overflow-hidden rounded-lg bg-[var(--surface-secondary)]">
                      <Image
                        alt={ingredient.name}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={ingredient.imageSrc}
                        unoptimized
                      />
                    </div>
                    <p className="text-label-3 w-20 truncate text-center font-medium">
                      {ingredient.name}
                    </p>
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-label-4 truncate font-medium text-[var(--primitive-grey-600)]">
                        {ingredient.amount}
                      </p>
                      <span
                        className={`text-label-4 font-xs inline-flex w-fit rounded-full px-2 ${
                          ingredient.status === 'unavailable' ? 'font-semibold' : 'font-normal'
                        } ${statusClassName[ingredient.status]}`}
                      >
                        {ingredient.statusLabel}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <button
              className="text-label-3 h-10 flex-1 rounded-full border-[1.5px] border-[var(--primitive-primary-400)] bg-[var(--surface-default)] font-medium text-[var(--primitive-black)]"
              disabled={!hasSelectedIngredient}
              onClick={handleAddSelectedIngredients}
              type="button"
            >
              선택 담기
            </button>
            <button
              className="text-label-3 h-10 flex-1 rounded-full border-[1.5px] border-[var(--primitive-primary-500)] bg-[var(--primitive-primary-300)] font-medium text-[var(--primitive-black)]"
              onClick={handleAddAllIngredients}
              style={{ borderColor: 'var(--primitive-primary-500)' }}
              type="button"
            >
              전체 담기
            </button>
          </div>
        </section>

        <section
          className="border-t border-[var(--border-subtle)] py-4"
          aria-labelledby="steps-heading"
          ref={stepsSectionRef}
        >
          <h2 className="text-title-4 font-semibold" id="steps-heading">
            조리 순서
          </h2>
          <ol className="mt-4 space-y-8">
            {steps.map((step) => (
              <li key={step.number}>
                <p className="text-label-3 font-semibold text-[var(--primitive-primary-700)]">
                  {step.number}
                </p>
                <p className="text-body-4 mt-2 leading-6 font-medium text-[var(--primitive-black)]">
                  {step.description}
                </p>
                {step.tips ? (
                  <p className="text-label-4 font-xs mt-3 rounded-sm bg-[var(--primitive-primary-100)] px-2 py-1 text-[var(--primitive-grey-600)]">
                    {step.tips}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <button
          className="text-title-4 h-12 w-full rounded-xl bg-[var(--primitive-primary-500)] font-semibold text-[var(--primitive-grey-800)]"
          onClick={handleCookingComplete}
          type="button"
        >
          조리 완료
        </button>
      </div>
      <Link
        aria-label={`장바구니 ${cartItemCount}개 상품`}
        className="fixed bottom-8 left-1/2 z-40 ml-[130px] grid size-10 place-items-center rounded-full bg-[var(--primitive-primary-500)] shadow-[var(--shadow-floating)]"
        href="/cart"
      >
        <Image
          alt=""
          aria-hidden="true"
          height={24}
          src="/images/recipe-detail/shoppingcart.svg"
          width={24}
        />
        {cartItemCount > 0 ? (
          <span className="text-caption absolute top-0 -right-1 grid size-[14px] place-items-center rounded-full bg-[var(--primitive-grey-800)] font-medium text-[var(--primitive-white)]">
            {cartItemCount}
          </span>
        ) : null}
      </Link>
      {isCookingGuideVisible ? (
        <p
          aria-live="polite"
          className="fixed top-4 left-1/2 z-50 inline-flex h-9 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--primitive-grey-800)] px-5 text-xs leading-5 whitespace-nowrap text-[var(--primitive-white)] shadow-[var(--shadow-floating)]"
          role="status"
        >
          <span className="text-xs leading-5 font-medium">요리 완성 후 하단의 </span>
          <strong className="text-xs leading-5 font-bold">조리 완료</strong>
          <span className="text-xs leading-5 font-medium">를 눌러 주세요.</span>
        </p>
      ) : null}
      {isCleanupSheetOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-[color:rgb(26_26_26_/_0.8)]"
          onClick={handleCleanupDismiss}
        >
          <section
            aria-labelledby="cleanup-sheet-title"
            aria-modal="true"
            className="mobile-page absolute bottom-0 left-1/2 max-h-[calc(100dvh-24px)] min-h-0 -translate-x-1/2 overflow-y-auto rounded-t-[20px] bg-[var(--surface-default)] pt-4 pb-10"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            style={{ minHeight: 0 }}
          >
            <div aria-hidden="true" className="flex h-[34px] justify-center">
              <span className="h-[5px] w-20 rounded-full bg-[var(--primitive-grey-800)]" />
            </div>
            <div className="px-4 pb-4">
              <h2 className="text-label-3 font-semibold" id="cleanup-sheet-title">
                요리 완성! 🎉
                <br />
                사용한 식재료를 정리할까요?
              </h2>
              {cleanupIngredients.length > 0 ? (
                <ul className="mt-4 grid grid-cols-3 justify-items-center gap-2">
                  {cleanupIngredients.map((ingredient) => {
                    const isSelected = selectedUsedIngredientIds.includes(ingredient.id);

                    return (
                      <li key={ingredient.id}>
                        <button
                          aria-label={`${ingredient.name} 사용 선택`}
                          aria-pressed={isSelected}
                          className="relative flex h-[140px] w-[114px] flex-col items-center justify-center rounded-xl border bg-[var(--surface-default)] px-3 transition-[border-color,transform] duration-200 ease-out active:scale-[0.98]"
                          onClick={() => handleUsedIngredientClick(ingredient.id)}
                          style={{
                            borderColor: isSelected
                              ? 'var(--primitive-primary-500)'
                              : 'var(--border-default)',
                            borderWidth: isSelected ? '1.5px' : '1px',
                          }}
                          type="button"
                        >
                          <div className="relative flex flex-col items-center gap-1 self-stretch">
                            <span
                              aria-hidden="true"
                              className="absolute -top-4 -right-[12.5px] z-10 grid size-10 place-items-center"
                            >
                              <span
                                className={`grid size-6 place-items-center rounded-full transition-colors duration-200 ${
                                  isSelected
                                    ? 'bg-[var(--primitive-primary-400)] text-[var(--primitive-grey-800)]'
                                    : 'bg-[var(--surface-disabled)] text-[var(--primitive-grey-400)]'
                                }`}
                              >
                                <Check size={18} strokeWidth={2} />
                              </span>
                            </span>
                            <div className="relative size-20 overflow-hidden rounded-lg bg-[var(--surface-secondary)]">
                              <Image
                                alt={ingredient.name}
                                className="object-cover"
                                fill
                                sizes="80px"
                                src={ingredient.imageSrc}
                                unoptimized
                              />
                            </div>
                            <p className="text-label-4 w-20 truncate text-center font-medium">
                              {ingredient.name}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-body-4 mt-4 rounded-xl bg-[var(--surface-secondary)] px-4 py-5 text-center font-medium text-[var(--text-secondary)]">
                  정리할 식재료가 없어요.
                </p>
              )}
            </div>
            <div className="flex gap-2 px-4">
              <button
                className="text-label-3 h-12 flex-1 rounded-xl bg-[var(--surface-disabled)] font-semibold text-[var(--text-primary)]"
                onClick={handleCleanupDismiss}
                type="button"
              >
                나중에
              </button>
              <button
                className="text-label-3 h-12 flex-1 rounded-xl bg-[var(--primitive-primary-500)] font-semibold text-[var(--primitive-grey-800)]"
                onClick={handleCleanupComplete}
                type="button"
              >
                정리하기
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {cleanupToast ? (
        <p
          aria-live="polite"
          className="fixed bottom-25 left-1/2 z-[70] inline-flex h-9 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--primitive-grey-800)] px-5 text-sm leading-5 font-medium whitespace-nowrap text-[var(--primitive-white)] shadow-[var(--shadow-floating)]"
          data-toast-type={cleanupToast.type}
          role="status"
        >
          {cleanupToast.message}
        </p>
      ) : null}
    </main>
  );
}
