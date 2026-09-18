'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useCartStore } from '@/entities/cart/model/cart-store';
import type { ProductDetail, ProductOption } from '@/entities/product/model/types';
import {
  createInitialOptionQuantities,
  selectCartProducts,
  updateOptionQuantity,
} from '@/features/product-cart/model/product-cart-selection';

import { ProductCartOptionSheet } from './product-cart-option-sheet';

interface ProductCartActionsProps {
  product: ProductDetail;
}

function getProductOptions(product: ProductDetail): ProductOption[] {
  return product.options ?? [{ id: 'default', label: product.weight, price: product.price }];
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function ProductCartActions({ product }: ProductCartActionsProps) {
  const options = getProductOptions(product);
  const addProducts = useCartStore((state) => state.addProducts);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [quantities, setQuantities] = useState(() => createInitialOptionQuantities(options));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstFocusableElement = dialog ? getFocusableElements(dialog)[0] : undefined;
    firstFocusableElement?.focus();
    if (!firstFocusableElement) dialog?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      const focusableElements = dialog ? getFocusableElements(dialog) : [];

      if (event.key !== 'Tab' || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (
        event.shiftKey &&
        (document.activeElement === firstElement || document.activeElement === dialog)
      ) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!showToast) return;

    const timeoutId = window.setTimeout(() => setShowToast(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  function handleAdd() {
    if (!product.isAvailable) return;

    const selectedProducts = selectCartProducts(product, quantities);
    if (selectedProducts.length === 0) return;

    addProducts(selectedProducts);
    setIsOpen(false);
    setShowToast(true);
  }

  return (
    <>
      {showToast ? (
        <div
          aria-live="polite"
          className="bg-surface-inverse text-text-inverse shadow-floating fixed bottom-16 left-1/2 z-40 flex h-9 w-[286px] -translate-x-1/2 items-center justify-between rounded-full px-4 text-sm leading-[21px] font-medium whitespace-nowrap"
          role="status"
        >
          <span>상품을 장바구니에 담았어요.</span>
          <Link
            className="focus-visible:ring-ring rounded-sm font-semibold underline focus-visible:ring-2"
            href="/cart"
          >
            장바구니 보기
          </Link>
        </div>
      ) : null}

      <footer className="bg-background fixed right-0 bottom-0 left-0 z-20 mx-auto h-[52px] w-full max-w-[var(--layout-mobile-design-frame)] px-4 pt-1">
        <div className="flex gap-2">
          <button
            aria-label={
              product.isAvailable
                ? '장바구니 옵션 선택'
                : '판매 불가 상품은 장바구니에 담을 수 없습니다'
            }
            className="bg-primary/15 text-primary focus-visible:ring-ring h-12 flex-1 rounded-xl text-lg font-semibold focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!product.isAvailable}
            onClick={() => setIsOpen(true)}
            ref={triggerRef}
            type="button"
          >
            장바구니
          </button>
          <button
            aria-disabled="true"
            aria-label="구매하기 기능 준비 중"
            className="bg-primary text-primary-foreground h-12 flex-1 rounded-xl text-lg font-semibold"
            type="button"
          >
            구매하기
          </button>
        </div>
      </footer>

      {isOpen ? (
        <ProductCartOptionSheet
          dialogRef={dialogRef}
          onAdd={handleAdd}
          onClose={() => setIsOpen(false)}
          onQuantityChange={(optionId, amount) =>
            setQuantities((current) => updateOptionQuantity(current, optionId, amount))
          }
          product={product}
          quantities={quantities}
        />
      ) : null}
    </>
  );
}
