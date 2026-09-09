'use client';

/** Figma 주문 내역 목업을 마이페이지의 첫 화면으로 제공합니다. */
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCartStore } from '@/entities/cart/model/cart-store';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

/* 목업 데이터. 실제 연동 후 수정될 부분 */
const orders = Array.from({ length: 4 }, (_, index) => ({
  id: `20260203${index + 1}`,
  orderedAt: '2026. 02. 03',
  productName: '에콰드르산 달콤 바나나',
  price: 3480,
}));

function OrderHistoryItem({ order }: { order: (typeof orders)[number] }) {
  const router = useRouter();
  const addProducts = useCartStore((state) => state.addProducts);

  function addOrderToCart() {
    addProducts([
      {
        id: `order-product-${order.id}`,
        ingredient: '1+1',
        name: order.productName,
        price: order.price,
      },
    ]);
    router.push('/cart');
  }

  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div
            aria-label={`${order.productName} 상품 이미지`}
            className="bg-border size-20 shrink-0 rounded-sm"
            role="img"
          />
          <div className="flex min-h-20 w-40 flex-col justify-start gap-1">
            <p className="text-disabled text-xs leading-4 font-medium">{order.orderedAt}</p>
            <div>
              <p className="text-sm leading-5 font-medium">{order.productName}</p>
              <p className="text-lg leading-7 font-bold">{order.price.toLocaleString()}원</p>
            </div>
          </div>
        </div>
        <button
          className="text-disabled flex shrink-0 items-center text-sm leading-5 font-semibold"
          type="button"
        >
          주문상세 <ChevronRight aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Link
          className="border-border text-text-secondary flex h-9 items-center justify-center rounded-sm border px-2 text-xs leading-5 font-medium"
          href="/mypage/delivery"
        >
          배송조회
        </Link>
        <button
          className="border-border text-text-secondary h-9 rounded-sm border px-2 text-xs leading-5 font-medium"
          onClick={addOrderToCart}
          type="button"
        >
          장바구니 담기
        </button>
      </div>
    </li>
  );
}

export function OrderHistoryPage() {
  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between px-4">
        <div aria-hidden="true" className="bg-border size-10 rounded-full" />
        <h1 className="text-heading-4 font-semibold">나의 주문 내역</h1>
        <div aria-hidden="true" className="bg-border size-10 rounded-full" />
      </header>

      <section className="h-8 px-4 py-2" aria-label="기간 설정">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs leading-4 font-medium">기간설정</span>
          <span aria-hidden="true" className="bg-border size-4 rounded-full" />
        </div>
      </section>

      <nav className="flex h-9 items-center gap-4 px-4" aria-label="주문 상태">
        <button
          aria-current="page"
          className="border-foreground h-9 border-b-2 text-sm leading-5 font-semibold"
          type="button"
        >
          전체
        </button>
        <button className="text-muted-foreground h-9 text-sm leading-5 font-medium" type="button">
          주문취소
        </button>
        <button className="text-muted-foreground h-9 text-sm leading-5 font-medium" type="button">
          환불
        </button>
      </nav>

      <section className="mt-4 flex-1 px-4 pb-8" aria-label="주문완료 목록">
        <h2 className="text-base leading-6 font-semibold">주문완료</h2>
        <ul className="mt-3 space-y-6">
          {orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </ul>
      </section>

      <BottomNavigation />
    </main>
  );
}
