'use client';

/** 기존 결제 완료 주문의 실제 상품을 배송 완료 화면으로 표시합니다. */
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useOrderHistoryQuery } from '@/entities/order/api/use-order-history-query';
import type { OrderHistoryRecord } from '@/entities/order/model/order-history';

const deliverySteps = [
  {
    icon: '/icons/delivery/status-ready.svg',
    label: '배송 준비',
    width: 16,
    height: 18,
    sizeClass: 'h-[17.9px] w-4',
  },
  {
    icon: '/icons/delivery/status-shipping.svg',
    label: '배송 중',
    width: 22,
    height: 15,
    sizeClass: 'h-[14.5px] w-[21.5px]',
  },
  {
    icon: '/icons/delivery/status-complete.svg',
    label: '배송 완료',
    width: 16,
    height: 18,
    sizeClass: 'h-[17.9px] w-4',
  },
] as const;

function DeliveryProgress({ isPreparing }: { isPreparing: boolean }) {
  const activeIndex = isPreparing ? 0 : deliverySteps.length - 1;

  return (
    <section className="px-3 py-4" aria-label="배송 진행 상태">
      <div className="flex h-23 items-center justify-center gap-4">
        {deliverySteps.map((step, index) => (
          <div className="flex items-center gap-4" key={step.label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`grid size-12 place-items-center rounded-full border ${
                  index === activeIndex
                    ? 'border-primary text-foreground bg-[var(--primitive-primary-300)]'
                    : 'border-border bg-background'
                }`}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className={`${step.sizeClass} ${
                    index === activeIndex
                      ? 'brightness-0 drop-shadow-[0_0_0.75px_currentColor]'
                      : 'opacity-50'
                  }`}
                  height={step.height}
                  src={step.icon}
                  width={step.width}
                />
              </div>
              <span
                className={`text-label-4 whitespace-nowrap ${
                  index === activeIndex ? 'text-foreground font-semibold' : 'text-text-secondary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < deliverySteps.length - 1 ? (
              <Image
                alt=""
                aria-hidden="true"
                className="-mt-7"
                height={28}
                src="/icons/delivery/status-arrow.svg"
                width={28}
              />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2
      className="border-border text-title-4 flex h-11 items-center border-b px-3 font-semibold"
      id={id}
    >
      {children}
    </h2>
  );
}

function PurchaseProducts({ order }: { order: OrderHistoryRecord }) {
  return (
    <section className="pb-4" aria-labelledby="purchase-product-title">
      <SectionTitle id="purchase-product-title">구매 상품</SectionTitle>
      <ul className="space-y-3 px-3 pt-2">
        {order.items.map((item) => (
          <li className="flex items-center gap-2" key={item.id}>
            <Image
              alt=""
              className="size-[76px] shrink-0 rounded-lg object-cover"
              height={76}
              src={item.thumbnailUrl || '/images/pantry/ingredient-image-placeholder.png'}
              unoptimized={Boolean(item.thumbnailUrl)}
              width={76}
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-disabled text-xs leading-4 font-medium">{order.orderedAt}</p>
              <p className="text-sm leading-5 font-medium">{item.name}</p>
              <p className="text-title-3 font-bold">
                {item.price.toLocaleString()}원
                <span className="text-disabled ml-1 text-sm leading-5 font-medium">
                  / {item.quantity}개
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-4 h-2 w-full bg-[var(--primitive-grey-100)]" />
    </section>
  );
}

function DeliveryOrderInfo({
  order,
  isPreparing,
}: {
  order: OrderHistoryRecord;
  isPreparing: boolean;
}) {
  return (
    <section aria-labelledby="delivery-complete-title">
      <SectionTitle id="delivery-complete-title">
        {isPreparing ? '주문 정보' : '배송 완료 정보'}
      </SectionTitle>
      <dl className="border-border grid grid-cols-[70px_minmax(0,1fr)] gap-x-5 gap-y-3 border-b px-3 py-5">
        <dt className="text-text-tertiary font-['Pretendard'] text-base leading-6">주문일자</dt>
        <dd className="text-text-secondary font-['Pretendard'] text-base leading-6">
          {order.orderedAt}
        </dd>
        <dt className="text-text-tertiary font-['Pretendard'] text-base leading-6">주문번호</dt>
        <dd className="text-text-secondary min-w-0 truncate font-['Pretendard'] text-base leading-6">
          {order.orderNumber}
        </dd>
        <dt className="text-text-tertiary font-['Pretendard'] text-base leading-6">결제 금액</dt>
        <dd className="text-text-secondary font-['Pretendard'] text-base leading-6">
          {order.paymentAmount.toLocaleString()}원
        </dd>
      </dl>
      <section className="pt-2" aria-labelledby="delivery-history-title">
        <SectionTitle id="delivery-history-title">배송 현황</SectionTitle>
        <ul>
          <li className="flex items-center gap-4 p-3">
            <span className="text-text-tertiary w-16 shrink-0 text-center text-xs">완료</span>
            <p className="text-text-secondary text-sm leading-5 font-medium">
              {isPreparing ? '상품 배송 준비 중' : '상품 배송 완료'}
            </p>
          </li>
        </ul>
      </section>
    </section>
  );
}

export function DeliveryTrackingPage({
  orderId,
  preparingOrderId,
}: {
  orderId?: string;
  preparingOrderId?: string;
}) {
  const isPreparing = Boolean(preparingOrderId);
  const {
    data: orders,
    isError,
    isPending,
    refetch,
  } = useOrderHistoryQuery(isPreparing ? undefined : 'CONFIRMED');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const selectedOrderId = preparingOrderId ?? orderId;
  const order =
    orders?.find((item) => item.id === selectedOrderId) ??
    (selectedOrderId ? undefined : orders?.[0]);

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <header className="relative flex h-12 items-center justify-center px-4">
        <Link
          aria-label="이전 화면"
          className="focus-visible:ring-ring absolute left-4 grid size-10 place-items-center rounded-full focus-visible:ring-2"
          href={isPreparing ? '/mypage/orders/preparing' : '/mypage/orders'}
        >
          <Image alt="" aria-hidden="true" height={24} src="/icons/delivery/back.svg" width={24} />
        </Link>
        <h1 className="text-heading-4 font-semibold">{isPreparing ? '배송 조회' : '배송 완료'}</h1>
      </header>

      {isError ? (
        <div className="px-4 py-8 text-center">
          <p className="text-text-secondary" role="alert">
            주문 내역을 불러오지 못했어요.
          </p>
          <button className="text-primary mt-4 font-semibold" onClick={() => void refetch()}>
            다시 시도
          </button>
        </div>
      ) : isPending ? (
        <p className="text-text-secondary px-4 py-8 text-center" role="status">
          주문 내역을 불러오는 중이에요.
        </p>
      ) : order ? (
        <div className="mx-4">
          <DeliveryProgress isPreparing={isPreparing} />
          <PurchaseProducts order={order} />
          <DeliveryOrderInfo isPreparing={isPreparing} order={order} />
          {orders && orders.length > 1 ? (
            <>
              {showAllOrders ? (
                <ul className="border-border divide-border divide-y border-b">
                  {orders
                    .filter((item) => item.id !== order.id)
                    .map((item) => (
                      <li className="px-3 py-4" key={item.id}>
                        <Link
                          className="flex items-center justify-between"
                          href={`/mypage/delivery?${isPreparing ? 'preparing' : 'orderId'}=${encodeURIComponent(item.id)}`}
                        >
                          <span>
                            {item.orderedAt} · {item.items[0]?.name ?? '주문 상품'}
                          </span>
                          <span className="text-text-secondary">배송 완료</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              ) : null}
              <button
                className="text-label-2 text-text-secondary flex w-full items-center justify-center gap-1 py-2 font-medium"
                onClick={() => setShowAllOrders((visible) => !visible)}
                type="button"
              >
                {showAllOrders ? '접기' : '다른 주문 보기'}
                <Image
                  alt=""
                  aria-hidden="true"
                  height={28}
                  src="/icons/delivery/chevron-down.svg"
                  width={28}
                />
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <p className="text-text-secondary px-4 py-8 text-center">주문 내역이 없어요.</p>
      )}
    </main>
  );
}
