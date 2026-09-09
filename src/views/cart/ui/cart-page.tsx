'use client';

import { ChefHat } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { getCartTotal, useCartStore } from '@/entities/cart/model/cart-store';

const SHIPPING_FEE = 3000;

export function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [deselectedIds, setDeselectedIds] = useState<string[]>([]);

  const selectedItems = useMemo(
    () => items.filter((item) => !deselectedIds.includes(item.id)),
    [deselectedIds, items],
  );
  const selectedTotal = getCartTotal(selectedItems);
  const hasSelectedItems = selectedItems.length > 0;
  const paymentTotal = selectedTotal + (hasSelectedItems ? SHIPPING_FEE : 0);
  const isAllSelected = selectedItems.length === items.length;

  function toggleItem(itemId: string) {
    setDeselectedIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId],
    );
  }

  function toggleAllItems() {
    setDeselectedIds(isAllSelected ? items.map((item) => item.id) : []);
  }

  function removeSelectedItems() {
    selectedItems.forEach((item) => removeProduct(item.id));
  }

  function removeAllItems() {
    items.forEach((item) => removeProduct(item.id));
  }

  return (
    <main className="mobile-page bg-background text-foreground min-h-dvh pt-[env(safe-area-inset-top)] pb-36">
      <header className="relative flex h-10 items-center px-4">
        <button
          aria-label="이전 페이지로 이동"
          className="grid size-10 place-items-center p-2"
          onClick={() => router.back()}
          type="button"
        >
          <Image alt="" className="size-6" height={24} src="/icons/cart/back.svg" width={24} />
        </button>
        <h1 className="text-heading-4 absolute left-1/2 -translate-x-1/2 font-semibold">
          장바구니
        </h1>
      </header>

      {items.length === 0 ? (
        <section className="flex min-h-[480px] flex-col items-center justify-center px-4 text-center">
          <div className="bg-muted text-muted-foreground grid size-20 place-items-center rounded-full">
            <ChefHat className="size-9" aria-hidden="true" strokeWidth={1.5} />
          </div>
          <h2 className="text-title-3 mt-5 font-bold">장바구니가 비어 있어요</h2>
          <p className="text-body-4 text-muted-foreground mt-2">
            레시피에서 필요한 식재료를 담아 보세요.
          </p>
          <Link
            className="bg-secondary text-secondary-foreground text-label-3 mt-6 rounded-2xl px-5 py-3 font-semibold"
            href="/"
          >
            레시피 보러 가기
          </Link>
        </section>
      ) : (
        <>
          <section className="px-4" aria-label="장바구니 상품">
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex items-center justify-between">
                <button
                  aria-pressed={isAllSelected}
                  className="flex items-center gap-1"
                  onClick={toggleAllItems}
                  type="button"
                >
                  <Image
                    alt=""
                    className="size-10"
                    height={40}
                    src="/icons/cart/checkbox.svg"
                    width={40}
                  />
                  <span className="text-label-2 font-semibold">전체 선택</span>
                </button>
                <div className="text-label-3 text-text-secondary flex items-center gap-2 pr-1 font-medium">
                  <button onClick={removeSelectedItems} type="button">
                    선택 삭제
                  </button>
                  <span className="text-disabled" aria-hidden="true">
                    |
                  </span>
                  <button onClick={removeAllItems} type="button">
                    전체 삭제
                  </button>
                </div>
              </div>

              <ul>
                {items.map((item) => {
                  const isSelected = !deselectedIds.includes(item.id);

                  return (
                    <li
                      className="border-border flex flex-col gap-[10px] border-b px-2 py-4"
                      key={item.id}
                    >
                      <div className="relative flex h-[76px] items-center gap-2">
                        <button
                          aria-label={`${item.name} 선택`}
                          aria-pressed={isSelected}
                          className="size-10 shrink-0"
                          onClick={() => toggleItem(item.id)}
                          type="button"
                        >
                          <Image
                            alt=""
                            className="size-10"
                            height={40}
                            src="/icons/cart/checkbox.svg"
                            width={40}
                          />
                        </button>
                        <div className="flex h-full min-w-0 flex-1 items-center gap-2">
                          <div
                            aria-label={`${item.name} 이미지`}
                            className="bg-border size-[76px] shrink-0 rounded-sm"
                            role="img"
                          />
                          <div className="flex h-full min-w-0 flex-1 flex-col gap-1">
                            <div className="min-w-0">
                              <p className="text-body-4 truncate font-medium">{item.name}</p>
                              <p className="text-body-4 text-text-secondary truncate font-medium">
                                옵션 : {item.ingredient}
                              </p>
                            </div>
                            <p className="text-title-3 font-bold">
                              {item.price.toLocaleString()}원
                            </p>
                          </div>
                        </div>
                        <div className="absolute right-0 -bottom-1 flex items-center gap-1">
                          <button
                            aria-label={`${item.name} 수량 줄이기`}
                            className="grid size-10 place-items-center"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            type="button"
                          >
                            <Image
                              alt=""
                              className="size-10"
                              height={40}
                              src="/icons/cart/quantity-control.svg"
                              width={40}
                            />
                          </button>
                          <span
                            aria-label={`${item.name} 수량`}
                            className="text-label-2 w-4 text-center font-medium"
                          >
                            {item.quantity}
                          </span>
                          <button
                            aria-label={`${item.name} 수량 늘리기`}
                            className="grid size-10 place-items-center"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            type="button"
                          >
                            <Image
                              alt=""
                              className="size-10"
                              height={40}
                              src="/icons/cart/quantity-control.svg"
                              width={40}
                            />
                          </button>
                        </div>
                      </div>
                      <button
                        className="text-label-2 rounded-sm bg-[var(--primitive-grey-200)] py-2 font-medium"
                        type="button"
                      >
                        옵션 변경
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="border-border mx-4 border-b py-4" aria-label="결제 금액">
            <h2 className="text-title-4 text-text-secondary font-semibold">결제 금액</h2>
            <dl className="mt-4 space-y-1.5">
              <div className="flex items-end justify-between">
                <dt className="text-title-4 text-text-secondary">주문 금액</dt>
                <dd className="text-title-3 font-semibold">{selectedTotal.toLocaleString()}원</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-title-4 text-text-secondary flex items-center gap-1">
                  배송비
                  <Image
                    alt="배송비 안내"
                    className="size-5"
                    height={20}
                    src="/icons/cart/info.svg"
                    width={20}
                  />
                </dt>
                <dd className="text-title-3 text-disabled font-semibold">
                  {hasSelectedItems ? SHIPPING_FEE.toLocaleString() : 0}원
                </dd>
              </div>
            </dl>
          </section>
        </>
      )}

      {items.length > 0 ? (
        <footer className="bg-background border-border fixed right-0 bottom-0 left-0 z-10 mx-auto w-full max-w-[var(--layout-mobile-design-frame)] border-t px-4 pt-1 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          <div className="text-title-4 text-text-secondary flex items-center justify-between px-2 py-1 font-medium">
            <span>총 주문 금액</span>
            <strong className="text-title-2 text-foreground font-semibold">
              {paymentTotal.toLocaleString()}원
            </strong>
          </div>
          <div className="flex h-16 gap-2 px-1 py-2">
            <Link
              className="bg-border text-text-secondary text-label-2 flex flex-1 items-center justify-center rounded-sm font-semibold"
              href="/"
            >
              상품 추가
            </Link>
            <button
              className="bg-muted-foreground text-background text-label-2 w-[220px] rounded-sm font-semibold disabled:opacity-50"
              disabled={!hasSelectedItems}
              type="button"
            >
              주문하기
            </button>
          </div>
        </footer>
      ) : null}
    </main>
  );
}
