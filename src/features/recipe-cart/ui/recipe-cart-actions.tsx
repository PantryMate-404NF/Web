'use client';

import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { type CartProduct, useCartStore } from '@/entities/cart/model/cart-store';
import { resolveAddToCartAction } from '@/features/recipe-cart/model/resolve-add-to-cart-action';
import {
  type LinkedRecipeProduct,
  selectPurchasableProducts,
} from '@/features/recipe-cart/model/select-purchasable-products';

interface RecipeCartActionsProps {
  linkedProducts: LinkedRecipeProduct[];
}

export function RecipeCartActions({ linkedProducts }: RecipeCartActionsProps) {
  const addProducts = useCartStore((state) => state.addProducts);
  const purchasableProducts = selectPurchasableProducts(linkedProducts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(purchasableProducts.map((product) => [product.id, 1])),
  );

  function showAddedMessage(message: string) {
    setAddedMessage(message);
    setIsSheetOpen(false);
  }

  function closeSheet() {
    setIsSheetOpen(false);
    selectButtonRef.current?.focus();
  }

  function updateQuantity(productId: string, amount: number) {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [productId]: Math.max(1, currentQuantities[productId] + amount),
    }));
  }

  function addToCart(products: CartProduct[], message: string) {
    addProducts(products);
    showAddedMessage(message);
  }

  function handleAdd(message: string) {
    const action = resolveAddToCartAction(purchasableProducts.length);

    if (action === 'unavailable') {
      showAddedMessage('연동된 상품이 없어요.');
      return;
    }

    if (action === 'direct-add') {
      addToCart(purchasableProducts, message);
      return;
    }

    setIsSheetOpen(true);
  }

  useEffect(() => {
    if (!isSheetOpen) {
      return;
    }

    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      : [];

    focusableElements[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeSheet();
        return;
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen]);

  return (
    <>
      <div className="bg-background border-border fixed right-0 bottom-0 left-0 z-10 mx-auto flex w-full max-w-[430px] gap-2 border-t px-4 py-3">
        <button
          className="text-foreground text-label-3 h-11 flex-1 rounded-2xl bg-[#dddee2] font-semibold"
          onClick={() => handleAdd('부족 식재료를 장바구니에 담았어요.')}
          type="button"
        >
          전체 담기
        </button>
        <button
          className="bg-secondary text-secondary-foreground text-label-3 h-11 flex-1 rounded-2xl font-semibold"
          onClick={() => handleAdd('상품을 장바구니에 담았어요.')}
          ref={selectButtonRef}
          type="button"
        >
          선택 담기
        </button>
      </div>

      {addedMessage && (
        <div
          aria-live="polite"
          className="bg-foreground text-background text-label-3 fixed right-4 bottom-24 left-4 z-20 mx-auto max-w-[398px] rounded-xl px-4 py-3 text-center font-medium shadow-lg"
        >
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" aria-hidden="true" />
            {addedMessage}
          </span>
          <Link className="mt-2 block underline underline-offset-2" href="/cart">
            장바구니 확인
          </Link>
        </div>
      )}

      {isSheetOpen && (
        <div className="bg-overlay/40 fixed inset-0 z-30 flex items-end" role="presentation">
          <section
            aria-label="부족 식재료 상품 선택"
            aria-modal="true"
            className="bg-card mx-auto w-full max-w-[430px] rounded-t-[20px] px-4 pt-3 pb-4 shadow-2xl"
            ref={dialogRef}
            role="dialog"
          >
            <div className="mx-auto h-1.5 w-20 rounded-full bg-[#949497]" />
            <ul className="mt-4 space-y-2">
              {purchasableProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex min-h-20 items-center rounded-lg bg-[#dddee2] p-3"
                >
                  <div className="grid size-[52px] shrink-0 place-items-center rounded-lg bg-[#c5c6c9] text-[#8e9094]">
                    <ShoppingCart className="size-5" aria-hidden="true" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 px-3">
                    <p className="text-label-4 text-muted-foreground">{product.ingredient}</p>
                    <p className="text-body-4 mt-0.5 truncate font-semibold">{product.name}</p>
                    <p className="text-label-4 text-muted-foreground mt-1">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label={`${product.name} 수량 줄이기`}
                      className="bg-background text-muted-foreground grid size-8 place-items-center rounded-full"
                      onClick={() => updateQuantity(product.id, -1)}
                      type="button"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <span
                      aria-label={`${product.name} 수량`}
                      className="text-title-4 w-5 text-center font-bold"
                    >
                      {quantities[product.id]}
                    </span>
                    <button
                      aria-label={`${product.name} 수량 늘리기`}
                      className="bg-background text-muted-foreground grid size-8 place-items-center rounded-full"
                      onClick={() => updateQuantity(product.id, 1)}
                      type="button"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                className="text-foreground text-label-3 h-11 flex-1 rounded-2xl bg-[#c5c6c9] font-semibold"
                onClick={closeSheet}
                type="button"
              >
                닫기
              </button>
              <button
                className="text-foreground text-label-3 h-11 flex-1 rounded-2xl bg-[#949497] font-semibold"
                onClick={() =>
                  addToCart(
                    purchasableProducts.flatMap((product) =>
                      Array.from({ length: quantities[product.id] }, () => product),
                    ),
                    '선택한 상품을 장바구니에 담았어요.',
                  )
                }
                type="button"
              >
                선택 담기
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
