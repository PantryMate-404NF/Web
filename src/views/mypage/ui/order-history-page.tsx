'use client';

/** 마이페이지의 주문·배송 현황과 결제 완료 주문 목록을 표시합니다. */
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useOrderHistoryQuery } from '@/entities/order/api/use-order-history-query';
import type { OrderHistoryRecord } from '@/entities/order/model/order-history';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

type OrderListStatus = 'paid' | 'preparing' | 'completed';

function OrderStatusSummary({
  status,
  orders,
}: {
  status: OrderListStatus;
  orders: OrderHistoryRecord[];
}) {
  const activeIndex = status === 'paid' ? 0 : status === 'preparing' ? 1 : 3;
  const completedOrders = orders.filter((order) => order.status === 'CONFIRMED');
  const statuses = [
    { label: '결제완료', count: completedOrders.length },
    { label: '배송준비', count: completedOrders.length },
    { label: '배송 중', count: 0 },
    { label: '배송완료', count: completedOrders.length },
  ];

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
              {item.label === '배송완료' ? (
                <Link
                  aria-label={`${item.count}건 배송완료 보기`}
                  className="inline-flex w-10 flex-col items-center gap-[5px]"
                  href="/mypage/orders/completed"
                >
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
                    {item.label}
                  </span>
                </Link>
              ) : (
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
              )}
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

function OrderHistoryItem({
  order,
  status,
}: {
  order: OrderHistoryRecord;
  status: OrderListStatus;
}) {
  const isPreparing = status === 'preparing';
  const isCompleted = status === 'completed';
  const isDeliveryList = isPreparing || isCompleted;

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
          {isPreparing ? '배송 준비' : isCompleted ? '배송 완료' : order.statusLabel}
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
              src={item.thumbnailUrl || '/images/pantry/ingredient-image-placeholder.png'}
              unoptimized={Boolean(item.thumbnailUrl)}
              width={76}
            />
            <div className="min-w-0">
              {!isDeliveryList ? (
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

      {isDeliveryList ? (
        <Link
          className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-[var(--primitive-primary-200)] text-sm leading-5 font-semibold"
          href={`/mypage/delivery?${isPreparing ? 'preparing' : 'orderId'}=${encodeURIComponent(order.id)}`}
        >
          배송조회
        </Link>
      ) : null}
    </li>
  );
}

export function OrderHistoryPage({ status = 'paid' }: { status?: OrderListStatus }) {
  const isPreparing = status === 'preparing';
  const isCompleted = status === 'completed';
  const isDeliveryList = isPreparing || isCompleted;
  const { state: authState } = useAuthSession();
  const shouldQuery = authState === 'complete' || authState === 'onboarding';
  const {
    data: orders,
    isError,
    isPending,
    refetch,
  } = useOrderHistoryQuery('CONFIRMED', shouldQuery);
  const isLoading = authState === 'loading' || (shouldQuery && isPending);

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <header className="border-border relative flex h-14 items-center justify-center border-b px-4">
        <Link
          aria-label="이전 화면으로 돌아가기"
          className="absolute left-4 grid size-8 place-items-center"
          href={isDeliveryList ? '/mypage/orders' : '/mypage'}
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

      <OrderStatusSummary status={status} orders={orders ?? []} />

      <section
        className="flex-1"
        aria-label={
          isPreparing
            ? '배송 준비 주문 목록'
            : isCompleted
              ? '배송 완료 주문 목록'
              : '결제 완료 주문 목록'
        }
      >
        {shouldQuery && isError ? (
          <div className="px-4 py-8 text-center">
            <p className="text-text-secondary" role="alert">
              주문 내역을 불러오지 못했어요.
            </p>
            <button className="text-primary mt-4 font-semibold" onClick={() => void refetch()}>
              다시 시도
            </button>
          </div>
        ) : isLoading ? (
          <p className="text-text-secondary px-4 py-8 text-center" role="status">
            주문 내역을 불러오는 중이에요.
          </p>
        ) : !shouldQuery ? (
          <div className="px-4 py-8 text-center">
            <p className="text-text-secondary">주문 내역을 보려면 로그인해 주세요.</p>
            <Link className="text-primary mt-4 inline-block font-semibold" href="/login">
              로그인하기
            </Link>
          </div>
        ) : orders?.length ? (
          <ul>
            {orders.map((order) => (
              <OrderHistoryItem key={order.id} order={order} status={status} />
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary px-4 py-8 text-center">주문 내역이 없어요.</p>
        )}
      </section>

      <BottomNavigation />
    </main>
  );
}
