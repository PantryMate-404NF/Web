/** 마이페이지의 주문·배송 현황과 결제 완료 주문 목록을 표시합니다. */
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ORDER_HISTORY_MOCK, type OrderHistoryMock } from '@/entities/order/model/mock';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

type OrderListStatus = 'paid' | 'preparing';

const orderStatuses = (status: OrderListStatus) =>
  [
    { label: '결제완료', count: status === 'paid' ? 1 : 0 },
    { label: '배송준비', count: status === 'preparing' ? 1 : 0 },
    { label: '배송 중', count: 0 },
    { label: '배송완료', count: 3 },
  ] as const;

function OrderStatusSummary({ status }: { status: OrderListStatus }) {
  const activeIndex = status === 'paid' ? 0 : 1;
  const statuses = orderStatuses(status);

  return (
    <>
      <div aria-hidden="true" className="h-2 w-full bg-[var(--primitive-grey-100)]" />
      <section className="bg-muted px-4 py-4" aria-label="주문 상태 상세현황">
        <div className="flex items-center justify-between">
          <h2 className="text-sm leading-5 font-semibold">상세현황</h2>
          <p className="text-disabled text-sm leading-5 font-medium">
            주문취소/환불 <strong className="font-semibold text-[var(--primitive-black)]">1</strong>
          </p>
        </div>
        <ol className="mt-6 flex items-start justify-center px-1.5">
          {statuses.map((item, index) => (
            <li className="flex items-start" key={item.label}>
              <div className="inline-flex w-10 flex-col items-center gap-[5px]">
                <strong
                  className={`text-2xl leading-9 font-semibold ${
                    index === activeIndex
                      ? 'text-[var(--primitive-primary-700)]'
                      : 'text-foreground'
                  }`}
                >
                  {item.count}
                </strong>
                <span
                  className={`text-xs leading-4 whitespace-nowrap ${
                    index === activeIndex
                      ? 'font-semibold text-[var(--primitive-primary-700)]'
                      : 'text-foreground font-medium'
                  }`}
                >
                  {status === 'paid' && item.label === '배송준비' ? (
                    <Link href="/mypage/orders/preparing">{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </span>
              </div>
              {index < statuses.length - 1 ? (
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
      <div aria-hidden="true" className="h-2 w-full bg-[var(--primitive-grey-100)]" />
    </>
  );
}

function OrderHistoryItem({ order, status }: { order: OrderHistoryMock; status: OrderListStatus }) {
  const isPreparing = status === 'preparing';

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
        <h2 className="text-base leading-6 font-semibold">
          {isPreparing ? '배송 준비' : order.status}
        </h2>
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

      <ul className="mt-4 space-y-4">
        {order.items.map((item) => (
          <li className="flex items-start gap-2" key={item.id}>
            <Image
              alt=""
              className="size-[76px] shrink-0 rounded-xl object-cover"
              height={76}
              src={item.imageSrc}
              width={76}
            />
            <div className="min-w-0">
              {!isPreparing ? (
                <p className="text-disabled mb-1 text-xs leading-[1.5] font-medium">
                  {order.orderedAt}
                </p>
              ) : null}
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

      {isPreparing ? (
        <Link
          className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-[var(--primitive-primary-200)] text-sm leading-5 font-semibold"
          href="/mypage/delivery"
        >
          배송조회
        </Link>
      ) : null}
    </li>
  );
}

export function OrderHistoryPage({ status = 'paid' }: { status?: OrderListStatus }) {
  const isPreparing = status === 'preparing';

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <header className="border-border relative flex h-14 items-center justify-center border-b px-4">
        <Link
          aria-label="이전 화면으로 돌아가기"
          className="absolute left-4 grid size-8 place-items-center"
          href={isPreparing ? '/mypage/orders' : '/mypage'}
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

      <OrderStatusSummary status={status} />

      <section
        className="flex-1"
        aria-label={isPreparing ? '배송 준비 주문 목록' : '결제 완료 주문 목록'}
      >
        <ul>
          <OrderHistoryItem order={ORDER_HISTORY_MOCK} status={status} />
        </ul>
      </section>

      <BottomNavigation />
    </main>
  );
}
