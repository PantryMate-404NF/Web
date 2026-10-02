import Image from 'next/image';
import Link from 'next/link';

import type { PaymentCompletionSnapshot } from '@/features/payment/model/payment-completion';
import type { PantryRegistrationFailure } from '@/features/payment/lib/register-purchased-items-in-pantry';

const pantryFailureLabels: Record<PantryRegistrationFailure['reason'], string> = {
  'missing-product-id': '상품 ID를 찾지 못했어요',
  'product-detail-request': '상품 정보를 불러오지 못했어요',
  'missing-product-name': '상품명이 비어 있어요',
  'missing-storage-type': '상품 보관 방법이 없거나 올바르지 않아요',
  'pantry-create-request': '팬트리 등록 요청이 거절됐어요',
};

function formatOrderDate(value: string) {
  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) return value;

  const dateParts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Seoul',
    year: 'numeric',
  }).formatToParts(timestamp);
  const date = Object.fromEntries(dateParts.map(({ type, value: part }) => [type, part]));

  return `${date.year}.${date.month}.${date.day}`;
}

function formatPhoneNumber(value: string | null) {
  if (!value) return '연락처 미등록';

  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return value;
}

function OrderProduct({
  item,
  orderedAt,
}: {
  item: PaymentCompletionSnapshot['items'][number];
  orderedAt: string;
}) {
  return (
    <li className="flex min-h-[76px] w-full items-start gap-2">
      {item.imageUrl ? (
        <Image
          alt=""
          aria-hidden="true"
          className="size-[76px] shrink-0 rounded-lg object-cover"
          height={76}
          src={item.imageUrl}
          unoptimized
          width={76}
        />
      ) : (
        <div aria-hidden="true" className="bg-surface-secondary size-[76px] shrink-0 rounded-lg" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1 self-stretch">
        <p className="text-text-tertiary text-xs leading-[18px] font-medium">
          {formatOrderDate(orderedAt)}
        </p>
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

export function PaymentCompleteView({
  isRetryingPantryRegistration = false,
  onRetryPantryRegistration,
  order,
  pantryRegistrationFailures = [],
  pantryRegistrationRetryMessage,
}: {
  isRetryingPantryRegistration?: boolean;
  onRetryPantryRegistration?: () => void;
  order: PaymentCompletionSnapshot;
  pantryRegistrationFailures?: PantryRegistrationFailure[];
  pantryRegistrationRetryMessage?: string;
}) {
  const recipientPhone = formatPhoneNumber(order.deliveryAddress.phoneNumber);
  const deliveryAddress = [
    order.deliveryAddress.addressLine1,
    order.deliveryAddress.addressLine2,
    order.deliveryAddress.postalCode ? `(${order.deliveryAddress.postalCode})` : '',
  ]
    .filter(Boolean)
    .join(' ');

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
          <p className="bg-surface-secondary text-text-tertiary flex max-w-full items-center rounded-full px-2.5 py-1 text-sm leading-[21px] font-medium whitespace-nowrap">
            <span className="shrink-0">주문번호</span>
            <span aria-hidden="true" className="text-disabled shrink-0 px-0.5">
              ㅣ
            </span>
            <span className="min-w-0 truncate">{order.orderNumber}</span>
          </p>
        </div>
      </section>

      {pantryRegistrationFailures.length > 0 ? (
        <section
          aria-label="팬트리 자동 등록 안내"
          className="bg-surface-complete mx-4 mb-4 flex flex-col gap-3 rounded-xl p-4"
          role="alert"
        >
          <p className="text-text-secondary text-sm leading-5">
            일부 식재료를 팬트리에 등록하지 못했어요. 팬트리에서 확인해 주세요.
          </p>
          <ul className="text-text-secondary mt-2 list-inside list-disc text-xs leading-5">
            {pantryRegistrationFailures.map((failure) => (
              <li key={failure.itemId}>
                {failure.itemName}: {pantryFailureLabels[failure.reason]}
              </li>
            ))}
          </ul>
          {pantryRegistrationRetryMessage ? (
            <p className="text-destructive mt-2 text-xs leading-5" role="alert">
              {pantryRegistrationRetryMessage}
            </p>
          ) : null}
          {onRetryPantryRegistration ? (
            <button
              className="bg-primary text-primary-foreground focus-visible:ring-ring mt-1 flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRetryingPantryRegistration}
              onClick={onRetryPantryRegistration}
              type="button"
            >
              {isRetryingPantryRegistration ? '팬트리에 다시 등록 중' : '팬트리 등록 다시 시도'}
            </button>
          ) : null}
          <Link
            className="border-border text-text-primary focus-visible:ring-ring bg-surface-default flex h-12 w-full items-center justify-center rounded-xl border text-base font-semibold focus-visible:ring-2"
            href="/pantry"
          >
            팬트리에서 확인하기
          </Link>
        </section>
      ) : null}

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
            {order.orderer.name || '이름 미등록'} / {formatPhoneNumber(order.orderer.phoneNumber)}
          </p>
        </InformationSection>

        <InformationSection heading="배송지">
          <p className="text-text-secondary text-sm leading-[21px]">
            {order.deliveryAddress.recipientName} / {recipientPhone}
          </p>
          <p className="text-text-secondary text-sm leading-[21px]">{deliveryAddress}</p>
        </InformationSection>

        <InformationSection heading="배송 요청사항">
          <dl className="flex flex-col gap-1.5 text-sm leading-[21px]">
            <div className="text-text-secondary flex gap-[76px]">
              <dt className="font-medium">수령위치</dt>
              <dd>{order.deliveryRequest.location}</dd>
            </div>
            <div className="flex gap-[76px]">
              <dt className="text-text-secondary font-medium">요청사항</dt>
              <dd className="text-disabled">{order.deliveryRequest.detail}</dd>
            </div>
          </dl>
        </InformationSection>

        <InformationSection heading="결제 금액">
          <dl className="text-text-secondary flex items-start justify-between text-sm leading-[21px]">
            <dt className="font-medium">최종 결제 금액</dt>
            <dd className="font-semibold">{order.paymentAmount.toLocaleString()}원</dd>
          </dl>
        </InformationSection>
      </div>

      <div className="mt-[117px] px-4">
        <Link
          className="bg-primary text-primary-foreground focus-visible:ring-ring flex h-[60px] w-full items-center justify-center rounded-xl text-lg leading-[27px] font-semibold focus-visible:ring-2"
          href="/mypage/orders"
        >
          주문 내역보기
        </Link>
      </div>
    </main>
  );
}
