/** 주문 내역에서 진입하는 배송 상태와 상품·배송 정보를 표시합니다. */
import Image from 'next/image';
import Link from 'next/link';

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

function PurchaseProduct() {
  return (
    <section className="border-border border-b-8 pb-4" aria-labelledby="purchase-product-title">
      <SectionTitle id="purchase-product-title">구매 상품</SectionTitle>
      <div className="flex items-center gap-2 px-3 pt-2">
        <Image
          alt="완전방사 무항생제 유정란"
          className="size-[76px] shrink-0 rounded-md object-cover"
          height={76}
          src="/images/delivery/antibiotic-free-eggs.png"
          width={76}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-label-4 text-disabled font-medium">2026.09.28</p>
          <div>
            <p className="text-body-4 font-medium">완전방사 무항생제 유정란</p>
            <p className="text-title-3 font-bold">6,700원</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryDetails() {
  return (
    <section aria-labelledby="delivery-detail-title">
      <SectionTitle id="delivery-detail-title">배송 상세</SectionTitle>
      <dl className="border-border grid grid-cols-[70px_minmax(0,1fr)] gap-x-5 gap-y-3 border-b px-3 py-4">
        {deliveryDetails.map(([label, value]) => (
          <div className="contents" key={label}>
            <dt className="text-base leading-6 font-medium text-[var(--primitive-grey-400)]">
              {label}
            </dt>
            <dd className="text-text-secondary relative text-base leading-6 font-medium">
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
    <section aria-labelledby="delivery-history-title">
      <SectionTitle id="delivery-history-title">배송 현황</SectionTitle>
      <ul>
        {deliveryHistory.map((history) => (
          <li className="flex items-center gap-4 p-3" key={`${history.date}-${history.time}`}>
            <time className="text-label-4 text-disabled w-16 shrink-0 text-center font-medium">
              <span className="block">{history.date}</span>
              <span className="block">{history.time}</span>
            </time>
            <p className="text-body-4 text-text-secondary font-medium">{history.status}</p>
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
          href="/mypage"
        >
          <Image alt="" aria-hidden="true" height={24} src="/icons/delivery/back.svg" width={24} />
        </Link>
        <h1 className="text-heading-4 font-semibold">배송 조회</h1>
      </header>

      <div className="mx-4">
        <DeliveryProgress />
        <PurchaseProduct />
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
