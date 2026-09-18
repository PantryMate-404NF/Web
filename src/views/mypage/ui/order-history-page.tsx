/** 마이페이지의 주문·배송 현황과 결제 완료 주문 목록을 표시합니다. */
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ORDER_HISTORY_MOCK, type OrderHistoryMock } from '@/entities/order/model/mock';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

const orderStatuses = [
  { label: '결제완료', count: 1 },
  { label: '배송준비', count: 0 },
  { label: '배송 중', count: 0 },
  { label: '배송완료', count: 3 },
] as const;

function OrderStatusSummary() {
  return (
    <section
      className="bg-muted border-surface-secondary border-y-8 px-4 py-4"
      aria-label="주문 상태 상세현황"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm leading-5 font-semibold">상세현황</h2>
        <p className="text-disabled text-sm leading-5 font-medium">
          주문취소/환불 <strong className="font-semibold text-[var(--primitive-black)]">1</strong>
        </p>
      </div>
      <ol className="mt-6 flex items-start justify-center px-1.5">
        {orderStatuses.map((status, index) => (
          <li className="flex items-start" key={status.label}>
            <div className="inline-flex w-10 flex-col items-center gap-[5px]">
              <strong
                className={`text-2xl leading-9 font-semibold ${
                  index === 0 ? 'text-[var(--primitive-primary-700)]' : 'text-foreground'
                }`}
              >
                {status.count}
              </strong>
              <span
                className={`text-xs leading-4 whitespace-nowrap ${
                  index === 0
                    ? 'font-semibold text-[var(--primitive-primary-700)]'
                    : 'text-foreground font-medium'
                }`}
              >
                {status.label}
              </span>
            </div>
            {index < orderStatuses.length - 1 ? (
              <span
                className="flex size-8 shrink-0 items-center justify-center pt-1"
                aria-hidden="true"
              >
                <ChevronRight className="text-disabled size-3" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function OrderHistoryItem({ order }: { order: OrderHistoryMock }) {
  return (
    <li className="px-4 py-4">
      <div className="flex items-center justify-between">
        <time className="text-xs leading-5 font-semibold">{order.orderedAt}</time>
        <Link
          className="text-text-secondary flex items-center text-xs leading-5 font-medium"
          href={`/mypage/orders/${order.id}`}
        >
          주문 상세
          <ChevronRight aria-hidden="true" className="size-5" />
        </Link>
      </div>

      <div aria-hidden="true" className="bg-border my-4 h-px" />

      <div className="flex items-center justify-between">
        <h2 className="text-base leading-6 font-semibold">{order.status}</h2>
        <span className="text-disabled flex items-center gap-0 text-xs leading-4 font-medium">
          {order.orderNumber}
          <Image
            alt=""
            aria-hidden="true"
            className="-ml-1"
            height={28}
            src="/images/order/copy-icon.svg"
            width={30}
          />
        </span>
      </div>

      <ul className="mt-5 space-y-5">
        {order.items.map((item) => (
          <li className="flex items-center gap-4" key={item.id}>
            <Image
              alt=""
              className="size-20 shrink-0 rounded-xl object-cover"
              height={80}
              src={item.imageSrc}
              width={80}
            />
            <div className="mb-7 min-w-0">
              <p className="text-sm leading-5 font-medium">{item.name}</p>
              <p className="mt-1 text-lg leading-7 font-bold">
                {item.price.toLocaleString()}원
                <span className="text-disabled ml-2 text-sm leading-5 font-medium">
                  / {item.quantity}개
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function OrderHistoryPage() {
  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <header className="border-border relative flex h-14 items-center justify-center border-b px-4">
        <Link
          aria-label="마이페이지로 돌아가기"
          className="absolute left-4 grid size-8 place-items-center"
          href="/mypage"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/images/mypage/back-arrow.svg"
            width={24}
          />
        </Link>
        <h1 className="text-heading-4 font-semibold">주문 / 배송 목록</h1>
      </header>

      <OrderStatusSummary />

      <section className="flex-1" aria-label="결제 완료 주문 목록">
        <ul>
          <OrderHistoryItem order={ORDER_HISTORY_MOCK} />
        </ul>
      </section>

      <BottomNavigation />
    </main>
  );
}
