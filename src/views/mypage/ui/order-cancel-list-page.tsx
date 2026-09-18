import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { getOrderHistoryMock } from '@/entities/order/model/mock';

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const order = getOrderHistoryMock(orderId);

  if (!order) {
    return null;
  }

  return (
    <main className="mobile-page bg-background min-h-dvh pb-8">
      <header className="relative flex h-16 items-center justify-center px-4">
        <Link
          aria-label="주문 취소/환불 "
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
        <h1 className="text-heading-4 font-semibold">주문 취소/환불</h1>
      </header>

      <div className="flex items-center justify-between px-4">
        <time className="text-xs leading-5 font-semibold">{order.orderedAt}</time>
        <Link
          className="text-text-secondary flex items-center text-xs leading-5 font-medium"
          href={`/mypage/orders/${order.id}`}
        >
          주문 상세
          <ChevronRight aria-hidden="true" className="size-5" />
        </Link>
      </div>

      <section className="border-border border-b-8 px-4 py-4" aria-labelledby="order-items-heading">
        <div className="flex items-center justify-between">
          <h2 className="text-base leading-6 font-semibold" id="order-items-heading">
            취소 완료
          </h2>
          <span className="text-disabled text-sm leading-5">{order.items.length}개</span>
        </div>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li className="flex items-center gap-3" key={item.id}>
              <Image
                alt=""
                className="size-16 shrink-0 rounded-xl object-cover"
                height={76}
                src={item.imageSrc}
                width={76}
              />
              <div className="min-w-0 flex-1">
                <time className="text-xs leading-4 font-medium text-[var(--primitive-grey-400)]">
                  {order.orderedAt}
                </time>
                <p className="text-sm leading-5 font-medium">{item.name}</p>
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
      </section>
    </main>
  );
}
