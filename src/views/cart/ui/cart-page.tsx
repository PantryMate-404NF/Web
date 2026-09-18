'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { getCartTotal, useCartStore } from '@/entities/cart/model/cart-store';
import type { CartItem } from '@/entities/cart/model/cart-store';
import { buildOrderHref } from '@/features/order/model/order-sheet';

const SHIPPING_FEE = 3000;

function SelectionControl({
  isSelected,
  label,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={isSelected}
      className={`focus-visible:ring-ring grid size-6 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 ${
        isSelected ? 'bg-primary' : 'bg-surface-disabled'
      }`}
      onClick={onClick}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        height={18}
        src={
          isSelected ? '/icons/cart/checkbox-selected.svg' : '/icons/cart/checkbox-unselected.svg'
        }
        width={18}
      />
    </button>
  );
}

export function CartOrderAction({
  cartId,
  selectedItems,
}: {
  cartId?: number;
  selectedItems: CartItem[];
}) {
  const className =
    'text-label-1 flex h-[60px] w-full items-center justify-center rounded-[12px] font-semibold';

  if (selectedItems.length === 0) {
    return (
      <button className={`${className} bg-surface-disabled text-disabled`} disabled type="button">
        결제하기
      </button>
    );
  }

  const href =
    cartId === undefined
      ? `/order?${new URLSearchParams({
          preview: '1',
          items: selectedItems.map((item) => item.id).join(','),
        }).toString()}`
      : buildOrderHref(
          cartId,
          selectedItems.map((item) => item.id),
        );

  return (
    <Link className={`${className} bg-primary text-primary-foreground`} href={href}>
      결제하기
    </Link>
  );
}

export interface CartPageProps {
  cartId?: number;
  errorMessage?: string;
  isLoading?: boolean;
  isMutating?: boolean;
  isUnauthorized?: boolean;
  items?: CartItem[];
  mutationErrorMessage?: string;
  onRemoveItems?: (items: CartItem[]) => void;
  onRetry?: () => void;
  onUpdateQuantity?: (item: CartItem, quantity: number) => void;
}

export function CartPage({
  cartId,
  errorMessage,
  isLoading = false,
  isMutating = false,
  isUnauthorized = false,
  items,
  mutationErrorMessage,
  onRemoveItems,
  onRetry,
  onUpdateQuantity,
}: CartPageProps = {}) {
  const router = useRouter();
  const storedItems = useCartStore((state) => state.items);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [deselectedIds, setDeselectedIds] = useState<string[]>([]);
  const currentItems = items ?? storedItems;

  const selectedItems = useMemo(
    () => currentItems.filter((item) => !deselectedIds.includes(item.id)),
    [currentItems, deselectedIds],
  );
  const selectedTotal = getCartTotal(selectedItems);
  const hasSelectedItems = selectedItems.length > 0;
  const paymentTotal = selectedTotal + (hasSelectedItems ? SHIPPING_FEE : 0);
  const isAllSelected = currentItems.length > 0 && selectedItems.length === currentItems.length;

  function toggleItem(itemId: string) {
    setDeselectedIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId],
    );
  }

  function toggleAllItems() {
    setDeselectedIds(isAllSelected ? currentItems.map((item) => item.id) : []);
  }

  function removeItems(targetItems: CartItem[]) {
    if (targetItems.length === 0) return;

    if (onRemoveItems) {
      onRemoveItems(targetItems);
      return;
    }

    targetItems.forEach((item) => removeProduct(item.id));
  }

  function changeQuantity(item: CartItem, quantity: number) {
    if (onUpdateQuantity) {
      onUpdateQuantity(item, quantity);
      return;
    }

    updateQuantity(item.id, quantity);
  }

  return (
    <main className="mobile-page bg-background text-foreground min-h-dvh overflow-x-clip pt-[env(safe-area-inset-top)]">
      <header className="relative flex h-16 items-center px-4">
        <button
          aria-label="이전 페이지로 이동"
          className="focus-visible:ring-ring -ml-2 grid size-10 place-items-center rounded-lg outline-none focus-visible:ring-2"
          onClick={() => router.back()}
          type="button"
        >
          <Image alt="" aria-hidden="true" height={24} src="/icons/cart/back.svg" width={24} />
        </button>
        <h1 className="text-heading-4 absolute left-1/2 -translate-x-1/2 font-semibold">
          장바구니
        </h1>
      </header>

      {isLoading ? (
        <section className="flex min-h-[480px] items-center justify-center px-4 text-center">
          <p className="text-text-secondary text-sm">장바구니를 불러오는 중이에요.</p>
        </section>
      ) : isUnauthorized ? (
        <section className="flex min-h-[480px] flex-col items-center justify-center px-4 text-center">
          <h2 className="text-title-3 font-bold">로그인이 필요해요</h2>
          <p className="text-body-4 text-text-secondary mt-2">
            로그인 후 장바구니를 이용해 주세요.
          </p>
          <Link
            className="bg-secondary text-secondary-foreground text-label-3 mt-6 rounded-2xl px-5 py-3 font-semibold"
            href="/login"
          >
            로그인하기
          </Link>
        </section>
      ) : errorMessage ? (
        <section className="flex min-h-[480px] flex-col items-center justify-center px-4 text-center">
          <p className="font-semibold">장바구니를 불러오지 못했어요.</p>
          <p className="text-text-secondary mt-2 text-sm">{errorMessage}</p>
          {onRetry ? (
            <button
              className="border-border focus-visible:ring-ring mt-5 rounded-full border px-4 py-2 outline-none focus-visible:ring-2"
              onClick={onRetry}
              type="button"
            >
              다시 시도
            </button>
          ) : null}
        </section>
      ) : currentItems.length === 0 ? (
        <section className="flex flex-col items-center px-4 pt-40 text-center">
          <Image
            alt="빈 장바구니 일러스트"
            className="h-40 w-40 object-contain"
            height={160}
            priority
            src="/images/cart/empty-cart.png"
            width={160}
          />
          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-title-4 text-text-tertiary font-semibold">장바구니가 비어있어요</h2>
            <p className="text-title-4 text-text-tertiary leading-6">
              필요한 식재료를 담고 한 번에
              <br />
              준비해보세요.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section
            aria-label="장바구니 상품"
            className="border-b-8 border-[var(--primitive-grey-100)]"
          >
            <div className="flex h-10 items-center justify-between pr-4 pl-3">
              <div className="flex items-center gap-1">
                <div className="flex size-8 items-center justify-center">
                  <SelectionControl
                    isSelected={isAllSelected}
                    label="전체 상품 선택"
                    onClick={toggleAllItems}
                  />
                </div>
                <span className="text-title-4 text-text-secondary font-medium tracking-[-1px]">
                  전체 선택 {selectedItems.length}/{currentItems.length}
                </span>
              </div>
              <button
                className="border-border text-label-4 focus-visible:ring-ring disabled:text-disabled h-8 w-[68px] rounded-lg border font-medium outline-none focus-visible:ring-2"
                disabled={isMutating || !hasSelectedItems}
                onClick={() => removeItems(selectedItems)}
                type="button"
              >
                선택삭제
              </button>
            </div>

            <ul className="flex flex-col gap-5 px-4 pt-5 pb-3">
              {currentItems.map((item, index) => {
                const isSelected = !deselectedIds.includes(item.id);
                const hasOption = item.ingredient !== '기본 옵션';

                return (
                  <li
                    className={`flex items-start justify-between pb-5 ${
                      index < currentItems.length - 1 ? 'border-border border-b-[1.5px]' : ''
                    }`}
                    key={item.id}
                  >
                    <SelectionControl
                      isSelected={isSelected}
                      label={`${item.name} 선택`}
                      onClick={() => toggleItem(item.id)}
                    />
                    <div
                      className={`flex w-[calc(100%-32px)] min-w-0 flex-col items-end ${
                        hasOption ? 'gap-3' : 'gap-2.5'
                      }`}
                    >
                      <div className="flex w-full min-w-0 gap-2">
                        <div
                          aria-label={`${item.name} 이미지`}
                          className="bg-surface-secondary size-[76px] shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
                          role="img"
                          style={
                            item.thumbnailUrl
                              ? { backgroundImage: `url(${JSON.stringify(item.thumbnailUrl)})` }
                              : undefined
                          }
                        />
                        <div className="flex min-w-0 flex-1 items-start self-stretch">
                          <div className="flex h-[51px] min-w-0 flex-1 flex-col gap-0.5">
                            <p className="text-label-3 w-full truncate font-medium">{item.name}</p>
                            <p className="text-title-3 font-bold">
                              {item.price.toLocaleString()}원
                            </p>
                          </div>
                          <div className="flex h-full shrink-0 flex-col items-end justify-between">
                            <button
                              aria-label={`${item.name} 삭제`}
                              className="focus-visible:ring-ring -mt-2 -mr-2 grid size-8 place-items-center rounded-lg outline-none focus-visible:ring-2"
                              disabled={isMutating}
                              onClick={() => removeItems([item])}
                              type="button"
                            >
                              <Image
                                alt=""
                                aria-hidden="true"
                                height={24}
                                src="/icons/cart/remove.svg"
                                width={24}
                              />
                            </button>
                            <div className="flex h-7 items-center">
                              <button
                                aria-label={`${item.name} 수량 줄이기`}
                                className="bg-surface-secondary focus-visible:ring-ring grid size-7 place-items-center rounded-lg outline-none focus-visible:ring-2 disabled:opacity-50"
                                disabled={isMutating || item.quantity <= 1}
                                onClick={() => changeQuantity(item, item.quantity - 1)}
                                type="button"
                              >
                                <Image
                                  alt=""
                                  aria-hidden="true"
                                  height={20}
                                  src="/icons/cart/minus.svg"
                                  width={20}
                                />
                              </button>
                              <span
                                aria-label={`${item.name} 수량`}
                                className="text-label-3 w-9 text-center font-medium"
                              >
                                {item.quantity}
                              </span>
                              <button
                                aria-label={`${item.name} 수량 늘리기`}
                                className="focus-visible:ring-ring grid size-7 place-items-center rounded-lg bg-[var(--primitive-primary-300)] outline-none focus-visible:ring-2 disabled:opacity-50"
                                disabled={isMutating}
                                onClick={() => changeQuantity(item, item.quantity + 1)}
                                type="button"
                              >
                                <Image
                                  alt=""
                                  aria-hidden="true"
                                  height={20}
                                  src="/icons/cart/plus.svg"
                                  width={20}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {hasOption ? (
                        <div className="border-border text-label-3 text-text-secondary flex h-10 w-full items-center justify-center rounded-lg border font-medium">
                          <span className="max-w-[calc(100%-24px)] truncate">
                            {item.ingredient}
                          </span>
                          <Image
                            alt=""
                            aria-hidden="true"
                            height={24}
                            src="/icons/cart/option-arrow.svg"
                            width={24}
                          />
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {mutationErrorMessage ? (
            <p className="text-destructive px-4 py-3 text-center text-sm" role="alert">
              {mutationErrorMessage}
            </p>
          ) : null}

          <section aria-label="결제 금액">
            <div className="border-border mx-4 border-b py-4">
              <h2 className="text-title-4 font-semibold">결제 금액</h2>
              <dl className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <dt className="text-title-4 text-text-secondary font-medium">주문 금액</dt>
                  <dd className="text-title-4 font-semibold">{selectedTotal.toLocaleString()}원</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-title-4 text-text-secondary flex items-center gap-1 font-medium">
                    배송비
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={20}
                      src="/icons/cart/info.svg"
                      width={20}
                    />
                  </dt>
                  <dd className="text-title-4 font-semibold">
                    {hasSelectedItems ? SHIPPING_FEE.toLocaleString() : 0}원
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-between px-4 py-6">
              <h2 className="text-title-4 font-semibold">최종 결제금액</h2>
              <p className="flex items-baseline gap-1">
                <strong className="text-title-2 font-bold">{paymentTotal.toLocaleString()}</strong>
                <span className="text-title-4 text-text-secondary font-medium">원</span>
              </p>
            </div>

            <div className="px-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
              <CartOrderAction cartId={cartId} selectedItems={selectedItems} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
