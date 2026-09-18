/** 주문의 상품, 배송지, 결제 정보 */
import Image from 'next/image';
import Link from 'next/link';

import { getOrderHistoryMock, ORDERER_MOCK } from '@/entities/order/model/mock';

function DetailRow({
  label,
  value,
  isDeliveryAddress = false,
}: {
  label: string;
  value: string;
  isDeliveryAddress?: boolean;
}) {
  return (
    <div className={`flex items-start py-2.5 ${isDeliveryAddress ? 'gap-[47px]' : 'gap-[35px]'}`}>
      <dt className="shrink-0 text-sm leading-5 font-medium text-[var(--primitive-grey-600)]">
        {label}
      </dt>
      <dd
        className={`min-w-0 flex-1 text-sm leading-5 font-medium text-[var(--primitive-black)] ${
          isDeliveryAddress ? 'whitespace-pre-line' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function PaymentSummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm leading-5 font-normal text-[var(--primitive-grey-400)]">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const order = getOrderHistoryMock(orderId);

  if (!order) {
    return null;
  }

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

      <section className="px-4 pt-4 pb-0" aria-labelledby="order-status-heading">
        <p className="text-sm leading-5 font-semibold text-[var(--primitive-black)]">
          {order.orderedAt}
        </p>
        <div aria-hidden="true" className="bg-border mt-4 h-px" />
      </section>

      <section className="border-border border-b-8 px-4 py-4" aria-labelledby="order-items-heading">
        <div className="flex items-center justify-between">
          <h2 className="text-base leading-6 font-semibold" id="order-items-heading">
            결제 완료
          </h2>
          <span className="text-disabled text-sm leading-5">{order.items.length}개</span>
        </div>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li className="flex items-center gap-3" key={item.id}>
              <Image
                alt=""
                className="size-16 shrink-0 rounded-xl object-cover"
                height={64}
                src={item.imageSrc}
                width={64}
              />
              <div className="mb-4 min-w-0 flex-1">
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
        <Link
          className="text-text-secondary mt-4 flex h-11 items-center justify-center rounded-md bg-[var(--primitive-grey-100)] text-sm leading-5 font-medium"
          href={`/mypage/orders/${order.id}/cancel`}
        >
          주문 취소
        </Link>
      </section>

      <section className="border-border border-b-8 px-4 py-5" aria-labelledby="order-info-heading">
        <h2 className="text-base leading-6 font-semibold" id="order-info-heading">
          주문 정보
        </h2>
        <dl className="mt-3 text-sm">
          <DetailRow label="주문 번호" value={order.orderNumber} />
          <DetailRow label="결제 금액" value={`${order.paymentAmount.toLocaleString()}원`} />
          <DetailRow label="결제 수단" value={order.paymentMethod} />
          <DetailRow
            isDeliveryAddress
            label="배송지"
            value={`${ORDERER_MOCK.name} / ${ORDERER_MOCK.phone}\n${order.deliveryAddress} ${order.deliveryDetail}`}
          />
        </dl>
      </section>

      <section className="px-4 py-5" aria-labelledby="payment-summary-heading">
        <h2 className="text-base leading-6 font-semibold" id="payment-summary-heading">
          결제 금액
        </h2>
        <dl className="mt-3">
          <PaymentSummaryRow label="주문 금액" value="19,100원" />
          <PaymentSummaryRow label="배송비" value="3,000원" />
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-base leading-6 font-semibold text-[var(--primitive-black)]">
              최종 결제금액
            </dt>
            <dd className="text-xl leading-7 font-bold text-[var(--primitive-black)]">
              {order.paymentAmount.toLocaleString()}원
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
