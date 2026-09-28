/** 주문 내역에서 진입하는 배송 상태와 상품·배송 정보를 표시합니다. */
import Image from 'next/image';
import Link from 'next/link';

import { ORDER_HISTORY_MOCK } from '@/entities/order/model/mock';

import { DeliveryTrackingCopyButton } from './delivery-tracking-copy-button';

const deliveryDetails = [
  ['배송일자', '2026.09.30'],
  ['택배사', 'CJ대한통운'],
  ['운송장번호', '441481641546'],
  ['택배기사님', '한바쁨'],
] as const;

const deliveryHistory = [
  { date: '2026.09.30', status: '상품 배송 완료', time: '21:08' },
  { date: '2026.09.30', status: '배송중(출고) / 광진A', time: '16:24' },
] as const;

const deliverySteps = [
  { icon: '/icons/delivery/status-ready.svg', label: '배송 준비' },
  { icon: '/icons/delivery/status-shipping.svg', label: '배송 중' },
  { icon: '/icons/delivery/status-complete.svg', label: '배송 완료' },
] as const;

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

function DeliveryProgress() {
  return (
    <section className="px-3 py-4" aria-label="배송 진행 상태">
      <div className="flex h-23 items-center justify-center gap-4">
        {deliverySteps.map((step, index) => (
          <div className="flex items-center gap-4" key={step.label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`grid size-12 place-items-center rounded-full border ${
                  index === deliverySteps.length - 1
                    ? 'border-primary bg-[var(--primitive-primary-300)]'
                    : 'border-border bg-background'
                }`}
              >
                <Image alt="" aria-hidden="true" height={24} src={step.icon} width={24} />
              </div>
              <span
                className={`text-label-4 whitespace-nowrap ${
                  index === deliverySteps.length - 1
                    ? 'text-foreground font-semibold'
                    : 'text-text-secondary'
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

function PurchaseProducts() {
  return (
    <>
      <section className="pb-4" aria-labelledby="purchase-product-title">
        <SectionTitle id="purchase-product-title">구매 상품</SectionTitle>
        <ul className="space-y-3 px-3 pt-2">
          {ORDER_HISTORY_MOCK.items.map((item) => (
            <li className="flex items-center gap-2" key={item.id}>
              <Image
                alt=""
                className="size-[76px] shrink-0 rounded-lg object-cover"
                height={76}
                src={item.imageSrc}
                width={76}
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-disabled text-xs leading-4 font-medium">
                  {ORDER_HISTORY_MOCK.orderedAt}
                </p>
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
      </section>
      <div aria-hidden="true" className="h-2 w-full bg-[var(--primitive-grey-50)]" />
    </>
  );
}

function DeliveryDetails() {
  return (
    <section aria-labelledby="delivery-detail-title">
      <SectionTitle id="delivery-detail-title">배송 상세</SectionTitle>
      <dl className="border-border grid grid-cols-[70px_minmax(0,1fr)] gap-x-5 gap-y-3 border-b px-3 py-5">
        {deliveryDetails.map(([label, value]) => (
          <div className="contents" key={label}>
            <dt className="text-text-tertiary font-['Pretendard'] text-base leading-6">{label}</dt>
            <dd className="text-text-secondary relative font-['Pretendard'] text-base leading-6">
              {label === '운송장번호' ? (
                <span className="relative inline-block">
                  {value}
                  <DeliveryTrackingCopyButton trackingNumber={value} />
                </span>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function DeliveryHistory() {
  return (
    <section className="pt-2" aria-labelledby="delivery-history-title">
      <SectionTitle id="delivery-history-title">배송 현황</SectionTitle>
      <ul>
        {deliveryHistory.map((history) => (
          <li className="flex items-center gap-4 p-3" key={`${history.date}-${history.time}`}>
            <time className="text-label-4 text-disabled w-16 shrink-0 text-center font-medium">
              <span className="text-text-tertiary block text-xs leading-4">{history.date}</span>
              <span className="text-text-tertiary block text-xs leading-4">{history.time}</span>
            </time>
            <p className="text-text-secondary text-sm leading-5 font-medium">{history.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DeliveryTrackingPage() {
  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <header className="relative flex h-12 items-center justify-center px-4">
        <Link
          aria-label="이전 화면"
          className="focus-visible:ring-ring absolute left-4 grid size-10 place-items-center rounded-full focus-visible:ring-2"
          href="/mypage/orders"
        >
          <Image alt="" aria-hidden="true" height={24} src="/icons/delivery/back.svg" width={24} />
        </Link>
        <h1 className="text-heading-4 font-semibold">배송 조회</h1>
      </header>

      <div className="mx-4">
        <DeliveryProgress />
        <PurchaseProducts />
        <DeliveryDetails />
        <DeliveryHistory />
        <button
          className="text-label-2 text-text-secondary flex w-full items-center justify-center gap-1 py-2 font-medium"
          type="button"
        >
          펼쳐보기
          <Image
            alt=""
            aria-hidden="true"
            height={28}
            src="/icons/delivery/chevron-down.svg"
            width={28}
          />
        </button>
      </div>
    </main>
  );
}
