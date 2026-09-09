/** Figma 배송조회 목업을 주문 내역에서 이어지는 상세 화면으로 제공합니다. */
import Image from 'next/image';

import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

const deliveryDetails = [
  ['배송예정일', '2026.02.10'],
  ['택배사', 'CJ대한통운'],
  ['운송장번호', '441481641546'],
  ['택배기사님', '한바쁨'],
] as const;

const deliveryHistory = [
  { date: '2026. 02. 04', time: '21:08', status: '상품 배송완료' },
  { date: '2026. 02. 04', time: '21:08', status: '상품 배송완료' },
] as const;

function DeliveryProgress() {
  return (
    <section
      className="border-border-subtle mx-4 flex h-23 items-center justify-center gap-6 border-b px-3"
      aria-label="배송 진행 상태"
    >
      {[0, 1, 2].map((step) => (
        <div className="flex items-center gap-6" key={step}>
          <Image
            alt=""
            aria-hidden="true"
            height={44}
            src="/icons/delivery/status-step.svg"
            width={44}
          />
          {step < 2 ? (
            <Image
              alt=""
              aria-hidden="true"
              height={18}
              src="/icons/delivery/status-connector.svg"
              width={18}
            />
          ) : null}
        </div>
      ))}
    </section>
  );
}

function DeliverySummary() {
  return (
    <section
      className="border-border-subtle mx-4 mt-4 flex items-center gap-2 border-b-8 px-3 pb-4"
      aria-label="주문 상품"
    >
      <div
        aria-label="에콰드르산 달콤 바나나 상품 이미지"
        className="bg-border size-[76px] shrink-0 rounded-sm"
        role="img"
      />
      <div className="flex flex-col gap-1">
        <p className="text-disabled text-xs leading-4 font-medium">2026. 02. 03</p>
        <div>
          <p className="text-sm leading-5 font-medium">에콰드르산 달콤 바나나</p>
          <p className="text-lg leading-7 font-bold">3,480원</p>
        </div>
      </div>
    </section>
  );
}

function DeliveryStatus() {
  return (
    <section aria-labelledby="delivery-complete-title">
      <h2
        className="border-border-subtle flex h-11 items-center border-b px-3 text-base leading-6 font-semibold"
        id="delivery-complete-title"
      >
        배송완료
      </h2>
      <dl className="border-border-subtle grid grid-cols-[70px_1fr] gap-x-5 gap-y-3 border-b px-3 py-4 text-[15px] leading-[1.5] font-medium">
        {deliveryDetails.map(([label, value]) => (
          <div className="contents" key={label}>
            <dt className="text-disabled">{label}</dt>
            <dd className="text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function DeliveryHistory() {
  return (
    <section aria-labelledby="delivery-history-title">
      <h2
        className="border-border-subtle flex h-11 items-center border-b px-3 text-base leading-6 font-semibold"
        id="delivery-history-title"
      >
        배송 상세현황
      </h2>
      <ul>
        {deliveryHistory.map((history, index) => (
          <li className="flex items-center gap-[18px] p-3" key={`${history.date}-${index}`}>
            <time className="text-disabled w-[70px] shrink-0 text-center text-xs leading-[1.5] font-medium whitespace-nowrap">
              <span className="block">{history.date}</span>
              <span className="block">{history.time}</span>
            </time>
            <div className="flex items-center gap-[18px]">
              <Image
                alt=""
                aria-hidden="true"
                height={40}
                src="/icons/delivery/history-status.svg"
                width={40}
              />
              <p className="text-text-secondary text-sm leading-5 font-medium">{history.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DeliveryTrackingPage() {
  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <header className="relative flex h-16 items-center justify-center px-4">
        <h1 className="text-heading-4 font-semibold">배송조회</h1>
        <Image
          alt=""
          aria-hidden="true"
          className="absolute right-4"
          height={40}
          src="/icons/delivery/header-action.svg"
          width={40}
        />
      </header>

      <DeliveryProgress />
      <DeliverySummary />

      <div className="mx-4">
        <DeliveryStatus />
        <DeliveryHistory />
        <button
          className="text-text-secondary flex w-full items-center justify-center gap-[7px] bg-[var(--primitive-grey-100)] py-3 text-sm leading-5 font-medium"
          type="button"
        >
          펼쳐보기
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/icons/delivery/chevron-down.svg"
            width={24}
          />
        </button>
      </div>

      <BottomNavigation />
    </main>
  );
}
