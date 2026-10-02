'use client';

/** 주문 상세 API의 상품과 결제 정보를 표시합니다. */
import Image from 'next/image';
import Link from 'next/link';

import { useOrderDetailQuery } from '@/entities/order/api/use-order-detail-query';
import { getOrderStatusLabel, formatOrderDate } from '@/entities/order/model/order-history';

function DetailRow({
  label,
  value,
  truncate = false,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-start gap-[35px] py-2.5">
      <dt className="shrink-0 text-sm leading-5 font-medium text-[var(--primitive-grey-600)]">
        {label}
      </dt>
      <dd
        className={
          truncate
            ? 'min-w-0 flex-1 truncate text-sm leading-5 font-medium text-[var(--primitive-black)]'
            : 'min-w-0 flex-1 text-sm leading-5 font-medium text-[var(--primitive-black)]'
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const { data: order, isError, isPending, refetch } = useOrderDetailQuery(orderId);

  return (
    <main className="mobile-page bg-background min-h-dvh pb-8">
      <header className="relative flex h-16 items-center justify-center px-4">
        <Link
          aria-label="주문 목록으로 돌아가기"
          className="absolute left-4 grid size-8 place-items-center"
          href="/mypage/orders"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/images/mypage/back-arrow.svg"
            width={24}
          />
        </Link>
        <h1 className="text-heading-4 font-semibold">주문 상세내역</h1>
      </header>

      {isPending ? (
        <p className="text-text-secondary px-4 py-10 text-center" role="status">
          주문 상세를 불러오는 중이에요.
        </p>
      ) : isError || !order ? (
        <div className="px-4 py-10 text-center">
          <p className="text-text-secondary" role="alert">
            주문 상세를 불러오지 못했어요.
          </p>
          <button className="text-primary mt-4 font-semibold" onClick={() => void refetch()}>
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <section className="px-4 pt-4 pb-0" aria-labelledby="order-status-heading">
            <p className="text-sm leading-5 font-semibold text-[var(--primitive-black)]">
              {formatOrderDate(order.createdAt)}
            </p>
            <div aria-hidden="true" className="bg-border mt-4 h-px" />
          </section>

          <section className="px-4 py-4" aria-labelledby="order-items-heading">
            <div className="flex items-center justify-between">
              <h2 className="text-base leading-6 font-semibold" id="order-items-heading">
                {getOrderStatusLabel(order.status)}
              </h2>
              <span className="text-disabled text-sm leading-5">{order.items.length}개</span>
            </div>
            <ul className="mt-4 space-y-4">
              {order.items.map((item, index) => (
                <li className="flex items-center gap-3" key={`${order.orderId}-${index}`}>
                  <Image
                    alt=""
                    className="size-16 shrink-0 rounded-xl object-cover"
                    height={64}
                    src={item.thumbnailUrl || '/images/pantry/ingredient-image-placeholder.png'}
                    unoptimized={Boolean(item.thumbnailUrl)}
                    width={64}
                  />
                  <div className="mb-4 min-w-0 flex-1">
                    <p className="text-sm leading-5 font-medium">{item.productName}</p>
                    <p className="text-disabled mt-1 text-xs leading-4">
                      <span className="text-lg leading-7 font-bold text-[var(--primitive-black)]">
                        {item.price.toLocaleString()}원{' '}
                      </span>{' '}
                      / {item.quantity}개
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {order.status === 'CONFIRMED' ? (
              <Link
                className="text-text-secondary mt-4 flex h-11 items-center justify-center rounded-md bg-[var(--primitive-grey-100)] text-sm leading-5 font-medium"
                href={`/mypage/orders/${encodeURIComponent(order.orderId)}/cancel`}
              >
                주문 취소
              </Link>
            ) : null}
          </section>
          <div aria-hidden="true" className="h-2 w-full bg-[var(--primitive-grey-100)]" />

          <section className="px-4 py-5" aria-labelledby="order-info-heading">
            <h2 className="text-base leading-6 font-semibold" id="order-info-heading">
              주문 정보
            </h2>
            <dl className="mt-3 text-sm">
              <DetailRow label="주문 번호" value={order.orderId} truncate />
              <DetailRow label="결제 금액" value={`${order.totalAmount.toLocaleString()}원`} />
              <DetailRow label="결제 수단" value={order.payment?.method ?? '확인 중'} />
            </dl>
          </section>
        </>
      )}
    </main>
  );
}
