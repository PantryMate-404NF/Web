'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { RecipeIngredient } from '@/entities/recipe/model/types';
import { useCartStore } from '@/entities/cart/model/cart-store';
import { useAddProductToCart } from '@/features/product-cart/model/use-add-product-to-cart';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { CART_HREF, CART_WRITE_MODE } from '@/shared/config/cart-write-mode';

import { getLocalRecipeCartProducts, getRecipeCartRequests } from '../model/recipe-cart-selection';

interface RecipeCartActionsProps {
  ingredients: RecipeIngredient[];
  selectedIngredientIds: string[];
  returnTo: string;
}

export function RecipeCartActions({
  ingredients,
  selectedIngredientIds,
  returnTo,
}: RecipeCartActionsProps) {
  const router = useRouter();
  const addPreviewProducts = useCartStore((state) => state.addProducts);
  const { restore, state: authState } = useAuthSession();
  const { addProduct } = useAddProductToCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const allRequests = getRecipeCartRequests(ingredients, [], 'all');
  const selectedRequests = getRecipeCartRequests(ingredients, selectedIngredientIds, 'selected');
  const allLocalProducts = getLocalRecipeCartProducts(ingredients, [], 'all');
  const selectedLocalProducts = getLocalRecipeCartProducts(
    ingredients,
    selectedIngredientIds,
    'selected',
  );
  const isPreview = CART_WRITE_MODE === 'preview';
  const isCartDisabled = CART_WRITE_MODE === 'disabled';
  const unavailableMessage = isCartDisabled
    ? '장바구니 기능을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.'
    : !isPreview && allRequests.length === 0
      ? '장바구니에 담을 수 있는 연동 상품이 없어요.'
      : isPreview && allLocalProducts.length === 0
        ? '장바구니에 담을 재료가 없어요.'
        : !isPreview && selectedIngredientIds.length > 0 && selectedRequests.length === 0
          ? '선택한 재료와 연결된 상품이 없어요.'
          : null;
  const statusMessage = message ?? unavailableMessage;

  async function addToCart(mode: 'all' | 'selected') {
    const requests = mode === 'all' ? allRequests : selectedRequests;
    const previewProducts = mode === 'all' ? allLocalProducts : selectedLocalProducts;
    setMessage(null);

    if (isCartDisabled) {
      setMessage('장바구니 기능을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (isPreview) {
      if (previewProducts.length === 0) {
        setMessage('장바구니에 담을 재료가 없어요.');
        return;
      }

      addPreviewProducts(previewProducts);
      router.push(CART_HREF);
      return;
    }
    if (requests.length === 0) {
      setMessage(
        mode === 'all'
          ? '장바구니에 담을 수 있는 연동 상품이 없어요.'
          : '선택한 재료와 연결된 상품이 없어요.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const resolvedAuthState = authState === 'loading' ? await restore() : authState;
      if (resolvedAuthState === 'guest') {
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      const results = await Promise.allSettled(requests.map((request) => addProduct(request)));
      const failures = results.filter((result) => result.status === 'rejected');
      if (failures.length > 0) {
        const succeededCount = results.length - failures.length;
        setMessage(
          succeededCount > 0
            ? '일부 상품만 장바구니에 담겼어요. 장바구니를 확인해 주세요.'
            : failures[0]?.reason instanceof Error
              ? failures[0].reason.message
              : '장바구니에 담지 못했어요.',
        );
        return;
      }

      router.push(CART_HREF);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '장바구니에 담지 못했어요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <button
          className="text-label-3 h-10 flex-1 rounded-full border-[1.5px] border-[var(--primitive-grey-200)] bg-[var(--surface-default)] font-medium text-[var(--primitive-black)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isSubmitting ||
            isCartDisabled ||
            (isPreview ? !selectedLocalProducts.length : !selectedRequests.length)
          }
          onClick={() => void addToCart('selected')}
          type="button"
        >
          선택 담기
        </button>
        <button
          className="text-label-3 h-10 flex-1 rounded-full border-[1.5px] border-[var(--primitive-primary-500)] bg-[var(--primitive-primary-300)] font-medium text-[var(--primitive-black)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isSubmitting ||
            isCartDisabled ||
            (isPreview ? !allLocalProducts.length : !allRequests.length)
          }
          onClick={() => void addToCart('all')}
          type="button"
        >
          부족 재료 담기
        </button>
      </div>
      {statusMessage ? (
        <p
          aria-live="polite"
          className="text-label-4 mt-2 text-[var(--primitive-grey-600)]"
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
