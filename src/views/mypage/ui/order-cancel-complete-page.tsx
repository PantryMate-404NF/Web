/** 주문 취소 요청 완료와 주문 목록 복귀 행동을 표시합니다. */
import { Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getOrderHistoryMock } from '@/entities/order/model/mock';

export function OrderCancelCompletePage({ orderId }: { orderId: string }) {
  const order = getOrderHistoryMock(orderId);

  if (!order) {
    return null;
  }

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col px-4">
      <header className="border-border relative flex h-16 items-center justify-center px-4">
        <Link
          aria-label="주문 상세로 돌아가기"
          className="absolute -left-1 grid size-8 place-items-center"
          href={`/mypage/orders/${order.id}`}
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/images/mypage/back-arrow.svg"
            width={24}
          />
        </Link>
        <h1 className="text-lg font-semibold text-[var(--primitive-black)]">취소 요청 완료</h1>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-[var(--primitive-primary-500)] text-[var(--primitive-grey-800)]">
          <Check aria-hidden="true" className="size-[42px]" strokeWidth={2} />
        </div>
        <h1 className="text-heading-3 mt-6 font-semibold">주문이 취소되었어요</h1>
        <p className="mt-3 max-w-72 text-sm leading-5 font-medium text-[var(--primitive-grey-400)]">
          <span className="block">환불은 이용하신 결제 방법에 따라</span>
          <span className="block">1~2일 이상 소요될 수 있습니다.</span>
        </p>
      </section>

      <Link
        className="bg-primary text-primary-foreground mb-[max(1rem,env(safe-area-inset-bottom))] flex h-15 items-center justify-center rounded-xl text-lg leading-7 font-semibold"
        href="/mypage/orders/cancel"
      >
        신청내역 보기
      </Link>
    </main>
  );
}
