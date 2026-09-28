import Image from 'next/image';
import Link from 'next/link';

import {
  DELIVERY_MOCK,
  ORDERER_MOCK,
  ORDER_HISTORY_MOCK,
  type OrderHistoryMock,
} from '@/entities/order/model/mock';

const paymentSuccessImages: Record<string, string> = {
  eggs: '/images/payment/payment-success-eggs.png',
  ketchup: '/images/mypage/order-detail-tomato-ketchup.png',
  tomatoes: '/images/payment/payment-success-tomatoes.png',
};

function OrderProduct({
  item,
  orderedAt,
}: {
  item: OrderHistoryMock['items'][number];
  orderedAt: string;
}) {
  return (
    <li className="flex h-[76px] w-full items-start gap-2">
      <Image
        alt=""
        aria-hidden="true"
        className="size-[76px] shrink-0 rounded-lg object-cover"
        height={76}
        src={paymentSuccessImages[item.id] ?? item.imageSrc}
        width={76}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 self-stretch">
        <p className="text-text-tertiary text-xs leading-[18px] font-medium">{orderedAt}</p>
        <div className="min-w-0">
          <p className="truncate text-sm leading-[21px] font-medium">{item.name}</p>
          <p className="text-lg leading-[27px] font-bold">
            {item.price.toLocaleString()}원
            {item.quantity > 1 ? (
              <span className="text-text-tertiary ml-1.5 text-sm font-medium">
                / {item.quantity}개
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </li>
  );
}

function InformationSection({ children, heading }: { children: React.ReactNode; heading: string }) {
  return (
    <section
      className="bg-background flex flex-col gap-2 p-4"
      aria-labelledby={`${heading}-heading`}
    >
      <h2
        className="text-text-secondary text-base leading-6 font-semibold"
        id={`${heading}-heading`}
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

export function PaymentCompleteView({ order = ORDER_HISTORY_MOCK }: { order?: OrderHistoryMock }) {
  return (
    <main className="mobile-page bg-background min-h-dvh pb-4">
      <section
        aria-labelledby="payment-complete-heading"
        className="flex h-[259px] flex-col items-center justify-center gap-4"
        role="status"
      >
        <div className="bg-primary grid size-16 place-items-center rounded-full">
          <span className="grid size-[52px] place-items-center">
            <Image
              alt=""
              aria-hidden="true"
              height={22}
              src="/icons/payment/success-check.svg"
              width={31}
            />
          </span>
        </div>
        <div className="flex w-full flex-col items-center gap-1.5 text-center">
          <h1 className="text-lg leading-[27px] font-semibold" id="payment-complete-heading">
            주문이 완료되었어요
          </h1>
          <p className="bg-surface-secondary text-text-tertiary rounded-full px-2.5 py-1 text-sm leading-[21px] font-medium">
            <span>주문번호</span>
            <span aria-hidden="true" className="text-disabled px-0.5">
              ㅣ
            </span>
            <span>{order.orderNumber}</span>
          </p>
        </div>
      </section>

      <section
        aria-labelledby="payment-order-items-heading"
        className="border-surface-secondary flex flex-col gap-2 border-t-8 p-4"
      >
        <h2
          className="text-text-secondary text-base leading-6 font-semibold"
          id="payment-order-items-heading"
        >
          주문 정보
        </h2>
        <ul className="flex flex-col gap-3">
          {order.items.map((item) => (
            <OrderProduct item={item} key={item.id} orderedAt={order.orderedAt} />
          ))}
        </ul>
      </section>

      <div className="bg-surface-secondary flex flex-col gap-2 pt-2">
        <InformationSection heading="주문자 정보">
          <p className="text-text-secondary text-sm leading-[21px]">
            {ORDERER_MOCK.name} / {ORDERER_MOCK.phone}
          </p>
        </InformationSection>

        <InformationSection heading="배송지">
          <p className="text-text-secondary text-sm leading-[21px]">
            {order.deliveryAddress} ({order.deliveryDetail})
          </p>
        </InformationSection>

        <InformationSection heading="배송 요청사항">
          <dl className="flex h-[49px] flex-col justify-center gap-1.5 text-sm leading-[21px]">
            <div className="text-text-secondary flex gap-[76px]">
              <dt className="font-medium">수령위치</dt>
              <dd>{DELIVERY_MOCK.location}</dd>
            </div>
            <div className="flex gap-[76px]">
              <dt className="text-text-secondary font-medium">요청사항</dt>
              <dd className="text-disabled">{DELIVERY_MOCK.detail}</dd>
            </div>
          </dl>
        </InformationSection>

        <InformationSection heading="결제 금액">
          <dl className="text-text-secondary flex items-start justify-between text-sm leading-[21px]">
            <dt className="font-medium">토스페이먼츠 (토스페이 / 일시불)</dt>
            <dd className="font-semibold">{order.paymentAmount.toLocaleString()}원</dd>
          </dl>
        </InformationSection>
      </div>

      <div className="mt-[117px] px-4">
        <Link
          className="bg-primary text-primary-foreground focus-visible:ring-ring flex h-[60px] w-full items-center justify-center rounded-xl text-lg leading-[27px] font-semibold focus-visible:ring-2"
          href={`/mypage/orders/${order.id}`}
        >
          주문 내역보기
        </Link>
      </div>
    </main>
  );
}
