'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useCartStore } from '@/entities/cart/model/cart-store';
import type { ProductDetail, ProductOption } from '@/entities/product/model/types';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { buildOrderHref } from '@/features/order/model/order-sheet';
import {
  createInitialOptionQuantities,
  getSelectedProductQuantity,
  selectCartProducts,
  updateOptionQuantity,
} from '@/features/product-cart/model/product-cart-selection';
import { useAddProductToCart } from '@/features/product-cart/model/use-add-product-to-cart';
import { CART_WRITE_MODE } from '@/shared/config/cart-write-mode';

import { ProductCartOptionSheet } from './product-cart-option-sheet';

interface ProductCartActionsProps {
  product: ProductDetail;
}

type CartAction = 'add' | 'buy';

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
  const router = useRouter();
  const options = getProductOptions(product);
  const apiProductId =
    CART_WRITE_MODE === 'mock-api' ? product.mockCommerceProductId : product.commerceProductId;
  const addPreviewProducts = useCartStore((state) => state.addProducts);
  const { restore, state: authState } = useAuthSession();
  const { addProduct, error, isPending, loadCart, reset } = useAddProductToCart();
  const [action, setAction] = useState<CartAction>('add');
  const [actionError, setActionError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPurchaseCartItemId, setPendingPurchaseCartItemId] = useState<number>();
  const [showToast, setShowToast] = useState(false);
  const [quantities, setQuantities] = useState(() => createInitialOptionQuantities(options));
  const addTriggerRef = useRef<HTMLButtonElement>(null);
  const buyTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const trigger = action === 'add' ? addTriggerRef.current : buyTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstFocusableElement = dialog ? getFocusableElements(dialog)[0] : undefined;
    firstFocusableElement?.focus();
    if (!firstFocusableElement) dialog?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (isSubmittingRef.current) return;
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
  }, [action, isOpen]);

  useEffect(() => {
    if (!showToast) return;

    const timeoutId = window.setTimeout(() => setShowToast(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  function openOptionSheet(nextAction: CartAction) {
    reset();
    setActionError(undefined);
    setAction(nextAction);
    setPendingPurchaseCartItemId(undefined);
    setIsOpen(true);
  }

  async function handleAdd() {
    if (!product.isAvailable || CART_WRITE_MODE === 'disabled') return;

    const quantity = getSelectedProductQuantity(quantities);
    if (quantity === 0) return;

    if (CART_WRITE_MODE === 'preview') {
      const selectedProducts = selectCartProducts(product, quantities);
      addPreviewProducts(selectedProducts);

      if (action === 'buy') {
        const searchParams = new URLSearchParams({
          items: selectedProducts.map((item) => item.id).join(','),
          preview: 'local',
        });
        router.push(`/order?${searchParams}`);
        return;
      }

      setIsOpen(false);
      setShowToast(true);
      return;
    }

    if (!apiProductId) return;

    setActionError(undefined);
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const resolvedAuthState = authState === 'loading' ? await restore() : authState;

      if (resolvedAuthState === 'guest') {
        router.push(`/login?returnTo=${encodeURIComponent(`/product/${product.id}`)}`);
        return;
      }

      const cartItemId =
        pendingPurchaseCartItemId ??
        (await addProduct({ productId: apiProductId, quantity })).cartItemId;

      if (action === 'buy') {
        setPendingPurchaseCartItemId(cartItemId);

        try {
          const cart = await loadCart();
          router.push(buildOrderHref(cart.cartId, [String(cartItemId)]));
        } catch {
          setActionError('상품은 담겼지만 주문 정보를 불러오지 못했어요. 다시 시도해 주세요.');
        }
        return;
      }

      setIsOpen(false);
      setShowToast(true);
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error ? caughtError.message : '장바구니에 담지 못했어요.',
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const isActionDisabled =
    !product.isAvailable ||
    CART_WRITE_MODE === 'disabled' ||
    ((CART_WRITE_MODE === 'api' || CART_WRITE_MODE === 'mock-api') && !apiProductId);
  const errorMessage = actionError ?? (error instanceof Error ? error.message : undefined);

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
            href={CART_WRITE_MODE === 'preview' ? '/cart?preview=local' : '/cart'}
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
            disabled={isActionDisabled || isPending || isSubmitting}
            onClick={() => openOptionSheet('add')}
            ref={addTriggerRef}
            type="button"
          >
            장바구니
          </button>
          <button
            aria-label={
              product.isAvailable
                ? '상품 옵션 선택 후 구매하기'
                : '판매 불가 상품은 구매할 수 없습니다'
            }
            className="bg-primary text-primary-foreground h-12 flex-1 rounded-xl text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isActionDisabled || isPending || isSubmitting}
            onClick={() => openOptionSheet('buy')}
            ref={buyTriggerRef}
            type="button"
          >
            구매하기
          </button>
        </div>
      </footer>

      {isOpen ? (
        <ProductCartOptionSheet
          actionLabel={action === 'buy' ? '구매하기' : '장바구니 담기'}
          dialogRef={dialogRef}
          errorMessage={errorMessage}
          isPending={isPending || isSubmitting}
          onAdd={handleAdd}
          onClose={() => {
            if (!isPending && !isSubmitting) setIsOpen(false);
          }}
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
