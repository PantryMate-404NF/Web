'use client';

import { ArrowLeft, ChefHat, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getCartItemCount, getCartTotal, useCartStore } from '@/entities/cart/model/cart-store';

export function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const itemCount = getCartItemCount(items);
  const total = getCartTotal(items);

  return (
    <main className="bg-background text-foreground mx-auto min-h-dvh w-full max-w-[430px] pb-28">
      <header className="flex h-20 items-center gap-1 px-4">
        <button
          aria-label="이전 페이지로 이동"
          className="grid size-10 place-items-center rounded-full"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-title-2 font-bold">장바구니</h1>
      </header>

      {items.length === 0 ? (
        <section className="flex min-h-[480px] flex-col items-center justify-center px-4 text-center">
          <div className="bg-muted grid size-20 place-items-center rounded-full text-[#949497]">
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
        <section className="px-4" aria-label="장바구니 상품">
          <p className="text-body-4 text-muted-foreground pb-3 font-medium">
            담은 상품 {itemCount}개
          </p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="relative flex min-h-24 items-center rounded-lg bg-[#dddee2] p-3"
              >
                <div className="grid size-[72px] shrink-0 place-items-center rounded-lg bg-[#c5c6c9] text-[#8e9094]">
                  <ChefHat className="size-7" aria-hidden="true" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1 px-2.5">
                  <p className="text-label-4 text-muted-foreground">{item.ingredient}</p>
                  <p className="text-body-4 mt-1 truncate font-semibold">{item.name}</p>
                  <p className="text-title-4 mt-1 font-bold">{item.price.toLocaleString()}원</p>
                </div>
                <div className="mt-7 flex items-center gap-2">
                  <button
                    aria-label={`${item.name} 수량 줄이기`}
                    className="bg-background text-muted-foreground grid size-7 place-items-center rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    type="button"
                  >
                    <Minus className="size-3.5" aria-hidden="true" />
                  </button>
                  <span
                    aria-label={`${item.name} 수량`}
                    className="text-title-4 w-3 text-center font-bold"
                  >
                    {item.quantity}
                  </span>
                  <button
                    aria-label={`${item.name} 수량 늘리기`}
                    className="bg-background text-muted-foreground grid size-7 place-items-center rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    type="button"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <button
                  aria-label={`${item.name} 삭제`}
                  className="text-muted-foreground absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full"
                  onClick={() => removeProduct(item.id)}
                  type="button"
                >
                  <Trash2 className="size-[18px]" aria-hidden="true" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {items.length > 0 && (
        <footer className="bg-background border-border fixed right-0 bottom-0 left-0 mx-auto w-full max-w-[430px] border-t px-4 pt-3 pb-4">
          <div className="text-body-4 flex items-center justify-between px-1">
            <span className="text-muted-foreground">총 {itemCount}개</span>
            <strong className="text-title-3">{total.toLocaleString()}원</strong>
          </div>
          <button
            className="bg-muted text-muted-foreground text-label-3 mt-3 h-12 w-full rounded-lg font-semibold"
            disabled
            type="button"
          >
            주문하기
          </button>
          <p className="text-label-4 text-muted-foreground mt-2 text-center">
            결제는 커머스 작업에서 제공됩니다.
          </p>
        </footer>
      )}
    </main>
  );
}
