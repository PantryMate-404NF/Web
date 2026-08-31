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
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white pb-28 text-[#131313]">
      <header className="flex h-20 items-center gap-1 px-4">
        <button
          aria-label="이전 페이지로 이동"
          className="grid size-10 place-items-center rounded-full"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-xl font-bold">장바구니</h1>
      </header>

      {items.length === 0 ? (
        <section className="flex min-h-[480px] flex-col items-center justify-center px-4 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-[#f3f4f5] text-[#949497]">
            <ChefHat className="size-9" aria-hidden="true" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 text-lg font-bold">장바구니가 비어 있어요</h2>
          <p className="mt-2 text-sm leading-5 text-[#68696d]">
            레시피에서 필요한 식재료를 담아 보세요.
          </p>
          <Link
            className="mt-6 rounded-2xl bg-[#6baa62] px-5 py-3 text-sm font-semibold text-white"
            href="/"
          >
            레시피 보러 가기
          </Link>
        </section>
      ) : (
        <section className="px-4" aria-label="장바구니 상품">
          <p className="pb-3 text-sm font-medium text-[#68696d]">담은 상품 {itemCount}개</p>
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
                  <p className="text-xs leading-4 text-[#68696d]">{item.ingredient}</p>
                  <p className="mt-1 truncate text-sm leading-5 font-semibold">{item.name}</p>
                  <p className="mt-1 text-base leading-5 font-bold">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
                <div className="mt-7 flex items-center gap-2">
                  <button
                    aria-label={`${item.name} 수량 줄이기`}
                    className="grid size-7 place-items-center rounded-full bg-white text-[#5d5e63]"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    type="button"
                  >
                    <Minus className="size-3.5" aria-hidden="true" />
                  </button>
                  <span
                    aria-label={`${item.name} 수량`}
                    className="w-3 text-center text-sm font-bold"
                  >
                    {item.quantity}
                  </span>
                  <button
                    aria-label={`${item.name} 수량 늘리기`}
                    className="grid size-7 place-items-center rounded-full bg-white text-[#5d5e63]"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    type="button"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <button
                  aria-label={`${item.name} 삭제`}
                  className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full text-[#68696d]"
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
        <footer className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-[430px] border-t border-[#e9e9eb] bg-white px-4 pt-3 pb-4">
          <div className="flex items-center justify-between px-1 text-sm">
            <span className="text-[#68696d]">총 {itemCount}개</span>
            <strong className="text-lg">{total.toLocaleString()}원</strong>
          </div>
          <button
            className="mt-3 h-12 w-full rounded-lg bg-[#6f6f71] text-sm font-semibold text-white"
            disabled
            type="button"
          >
            주문하기
          </button>
          <p className="mt-2 text-center text-xs text-[#68696d]">
            결제는 커머스 작업에서 제공됩니다.
          </p>
        </footer>
      )}
    </main>
  );
}
