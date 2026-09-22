'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { buildAddressListHref } from '@/entities/address/model/address';
import { selectSelectedAddress, useAddressStore } from '@/entities/address/model/address-store';
import { useCartStore } from '@/entities/cart/model/cart-store';
import type { CartItem } from '@/entities/cart/model/cart-store';
import { createOrder } from '@/entities/order/api/create-order';
import { DELIVERY_MOCK, ORDERER_MOCK } from '@/entities/order/model/mock';
import {
  areAllRequiredAgreementsSelected,
  buildPaymentExecutionInput,
  calculateOrderAmounts,
  getSelectedCartItemIds,
  ORDER_AGREEMENT_IDS,
  selectOrderItems,
  toggleOrderAgreement,
} from '@/features/order/model/order-sheet';
import type { OrderAgreementId } from '@/features/order/model/order-sheet';
import { preparePayment } from '@/features/payment/api/prepare-payment';
import { requestTossPayment } from '@/features/payment/lib/request-toss-payment';
import { createPaymentExecutor } from '@/features/payment/model/payment-flow';
import { BackButton } from '@/shared/ui/back-button';

const AGREEMENT_LABELS: Record<OrderAgreementId, string> = {
  'personal-info': '개인(신용)정보 수집 및 이용 동의',
  service: '서비스 이용약관',
  'third-party': '개인(신용)정보 제3자 제공 동의',
};

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

function MiniAction({ children, disabled = false }: { children: string; disabled?: boolean }) {
  return (
    <button
      aria-disabled={disabled}
      className="border-border-strong text-text-secondary rounded-full border px-3 py-1 text-sm leading-[21px] font-medium disabled:cursor-not-allowed"
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

function AgreementCheck({ checked }: { checked: boolean }) {
  return (
    <span
      className={`${checked ? 'bg-primary text-primary-foreground' : 'bg-surface-disabled text-disabled'} grid size-6 shrink-0 place-items-center rounded-full`}
    >
      <Check aria-hidden="true" className="size-4" strokeWidth={1.8} />
    </span>
  );
}

function TossPaymentsBadge() {
  return (
    <span className="bg-background border-border flex h-7 items-center gap-1 rounded-full border px-2">
      <Image
        alt=""
        aria-hidden="true"
        className="h-4 w-[17px] object-contain"
        height={16}
        src="/images/order/toss-symbol.png"
        width={17}
      />
      <Image
        alt="toss"
        className="h-3 w-[34px]"
        height={12}
        src="/images/order/toss-wordmark.svg"
        width={34}
      />
    </span>
  );
}

export function OrderSheet({
  cartId,
  items,
  orderReturnTo = '/order',
  selectedCartItemIds = [],
}: {
  cartId?: number;
  items: CartItem[];
  orderReturnTo?: string;
  selectedCartItemIds?: number[];
}) {
  const [isOrdererExpanded, setIsOrdererExpanded] = useState(false);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [selectedAgreements, setSelectedAgreements] = useState<string[]>([]);
  const [paymentNotice, setPaymentNotice] = useState('');
  const selectedAddress = useAddressStore(selectSelectedAddress);
  const [executePayment] = useState(() =>
    createPaymentExecutor({
      createOrder,
      preparePayment,
      requestPayment: requestTossPayment,
    }),
  );
  const idempotencyKeyRef = useRef<string | null>(null);
  const amounts = calculateOrderAmounts(items);
  const isAllAgreed = areAllRequiredAgreementsSelected(selectedAgreements);

  if (items.length === 0) {
    return (
      <main className="mobile-page bg-background min-h-dvh">
        <header className="relative flex h-16 items-center px-2">
          <BackButton fallbackHref="/cart" />
          <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">주문서</h1>
        </header>
        <section className="flex min-h-[560px] flex-col items-center justify-center px-4 text-center">
          <h2 className="text-title-2 font-semibold">주문할 상품이 없어요</h2>
          <p className="text-text-secondary mt-2 text-sm">장바구니에서 상품을 선택해 주세요.</p>
          <Link
            className="bg-primary text-primary-foreground focus-visible:ring-ring mt-6 rounded-xl px-5 py-3 font-semibold focus-visible:ring-2"
            href="/cart"
          >
            장바구니로 이동
          </Link>
        </section>
      </main>
    );
  }

  function toggleAllAgreements() {
    setSelectedAgreements(isAllAgreed ? [] : [...ORDER_AGREEMENT_IDS]);
  }

  async function handlePayment() {
    setIsPaymentPending(true);
    setPaymentNotice('');

    try {
      idempotencyKeyRef.current ??= crypto.randomUUID();
      const input = buildPaymentExecutionInput(
        cartId,
        selectedCartItemIds,
        idempotencyKeyRef.current,
      );

      await executePayment(input);
    } catch (error) {
      setPaymentNotice(error instanceof Error ? error.message : '결제를 시작하지 못했습니다.');
    } finally {
      setIsPaymentPending(false);
    }
  }

  return (
    <main className="mobile-page bg-background min-h-dvh pb-24">
      <header className="relative flex h-16 items-center px-2">
        <BackButton fallbackHref="/cart" />
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">주문서</h1>
      </header>

      <section aria-labelledby="orderer-heading" className="min-h-14 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-title-4 text-text-secondary font-semibold" id="orderer-heading">
            주문자 정보
          </h2>
          <button
            aria-expanded={isOrdererExpanded}
            aria-label="주문자 정보 상세"
            className="text-text-secondary focus-visible:ring-ring flex items-center gap-2 rounded-sm text-[15px] leading-[23px] focus-visible:ring-2"
            onClick={() => setIsOrdererExpanded((expanded) => !expanded)}
            type="button"
          >
            <span className="text-right">
              <span className="block">
                {ORDERER_MOCK.name} <span className="text-disabled">l</span> {ORDERER_MOCK.phone}
              </span>
              {isOrdererExpanded ? <span className="block">{ORDERER_MOCK.email}</span> : null}
            </span>
            <Image
              alt=""
              aria-hidden="true"
              className={`size-5 transition-transform ${isOrdererExpanded ? 'rotate-180' : ''}`}
              height={20}
              src="/icons/order/chevron-down.svg"
              width={20}
            />
          </button>
        </div>
      </section>

      <section
        aria-labelledby="delivery-heading"
        className="border-muted flex h-[137px] flex-col gap-4 border-y-8 px-4 py-4"
      >
        <h2 className="text-title-4 text-text-secondary font-semibold" id="delivery-heading">
          배송지
        </h2>
        <div className="flex h-[49px] items-end justify-between gap-3">
          <p className="text-text-secondary h-full w-[259px] text-[15px] leading-[23px]">
            {selectedAddress
              ? `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2} (${selectedAddress.postalCode})`
              : DELIVERY_MOCK.address}
          </p>
          <Link
            className="border-border-strong text-text-secondary focus-visible:ring-ring shrink-0 rounded-full border px-3 py-1 text-sm leading-[21px] font-medium focus-visible:ring-2"
            href={buildAddressListHref(orderReturnTo)}
          >
            변경
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="request-heading"
        className="border-muted flex h-[129px] flex-col gap-4 border-b-8 px-4 py-4"
      >
        <h2 className="text-title-4 text-text-secondary font-semibold" id="request-heading">
          배송 요청사항
        </h2>
        <div className="flex h-[49px] items-end justify-between gap-3">
          <dl className="grid h-full flex-1 grid-cols-[49px_1fr] content-center gap-x-[76px] gap-y-1.5 text-sm leading-[21px]">
            <dt className="text-text-secondary">수령위치</dt>
            <dd className="font-medium">{DELIVERY_MOCK.location}</dd>
            <dt className="text-text-secondary">요청사항</dt>
            <dd className="text-disabled">{DELIVERY_MOCK.detail}</dd>
          </dl>
          <MiniAction disabled>변경</MiniAction>
        </div>
      </section>

      <section
        aria-labelledby="payment-method-heading"
        className="border-muted flex h-[340px] flex-col gap-4 border-b-8 px-4 pt-6 pb-1.5"
      >
        <h2 className="text-title-4 text-text-secondary font-semibold" id="payment-method-heading">
          결제 수단
        </h2>
        <div className="flex flex-col gap-6">
          <div className="bg-surface-secondary flex h-[53px] items-center justify-between rounded-xl px-2 py-3">
            <div className="flex items-center gap-1.5">
              <TossPaymentsBadge />
              <span className="text-title-4 text-text-secondary font-medium">토스페이먼츠</span>
            </div>
            <span className="bg-background text-text-secondary rounded-full px-3 py-1 text-sm leading-[21px] font-medium">
              변경
            </span>
          </div>

          <div className="h-[185px]">
            <button
              aria-pressed={isAllAgreed}
              className="border-border focus-visible:ring-ring flex h-[49px] w-full items-center gap-1 border-b pb-2 text-left focus-visible:ring-2"
              onClick={toggleAllAgreements}
              type="button"
            >
              <AgreementCheck checked={isAllAgreed} />
              <span className="text-text-secondary min-w-0 flex-1 text-sm leading-[21px] font-medium">
                [필수] 결제 서비스 이용 약관 개인정보 처리 동의
              </span>
              <Image
                alt="약관 상세 보기"
                className="size-5 shrink-0"
                height={20}
                src="/icons/order/external-link.svg"
                width={20}
              />
            </button>
            <div className="h-[136px] py-2">
              {ORDER_AGREEMENT_IDS.map((agreementId) => {
                const isChecked = selectedAgreements.includes(agreementId);

                return (
                  <button
                    aria-pressed={isChecked}
                    className="focus-visible:ring-ring flex h-10 w-full items-center gap-1 rounded-sm text-left focus-visible:ring-2"
                    key={agreementId}
                    onClick={() =>
                      setSelectedAgreements((current) => toggleOrderAgreement(current, agreementId))
                    }
                    type="button"
                  >
                    <AgreementCheck checked={isChecked} />
                    <span className="text-text-secondary text-[13px] leading-5 font-medium">
                      {AGREEMENT_LABELS[agreementId]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="amount-heading" className="h-[201px] px-4">
        <div className="border-border flex h-[129px] flex-col gap-4 border-b py-4">
          <h2 className="text-title-4 text-text-secondary font-semibold" id="amount-heading">
            결제 금액
          </h2>
          <dl className="flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <dt className="text-title-4 text-text-secondary font-medium">주문 금액</dt>
              <dd className="text-title-3 font-semibold">{formatPrice(amounts.orderAmount)}원</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-title-4 text-text-secondary flex items-center gap-1 font-medium">
                배송비
                <Image
                  alt="배송비 안내"
                  className="size-5"
                  height={20}
                  src="/icons/order/info.svg"
                  width={20}
                />
              </dt>
              <dd className="text-title-3 text-disabled font-medium">
                {formatPrice(amounts.shippingFee)}원
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex h-[72px] items-center justify-between py-6">
          <h2 className="text-title-4 font-semibold">최종 결제금액</h2>
          <p className="flex items-center gap-1">
            <strong className="text-heading-3 font-semibold">
              {formatPrice(amounts.finalAmount)}
            </strong>
            <span className="text-title-4 text-text-secondary font-medium">원</span>
          </p>
        </div>
      </section>

      <footer className="bg-background fixed bottom-0 left-1/2 z-20 w-full max-w-[390px] -translate-x-1/2 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        {paymentNotice ? (
          <p className="text-destructive mb-2 text-center text-sm" id="payment-notice" role="alert">
            {paymentNotice}
          </p>
        ) : null}
        <button
          aria-describedby={paymentNotice ? 'payment-notice' : undefined}
          className="bg-primary text-primary-foreground focus-visible:ring-ring h-15 w-full rounded-xl text-lg font-semibold focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isAllAgreed || isPaymentPending}
          onClick={() => {
            void handlePayment();
          }}
          type="button"
        >
          {isPaymentPending ? '결제 준비 중' : '결제하기'}
        </button>
      </footer>
    </main>
  );
}

export function OrderPage({
  cartId,
  errorMessage,
  isLoading = false,
  items,
  onRetry,
  orderReturnTo = '/order',
  selectedItemIds,
}: {
  cartId?: number;
  errorMessage?: string;
  isLoading?: boolean;
  items?: CartItem[];
  onRetry?: () => void;
  orderReturnTo?: string;
  selectedItemIds: string[];
}) {
  const cartItems = useCartStore((state) => state.items);
  const orderItems = selectOrderItems(items ?? cartItems, selectedItemIds);

  if (isLoading) {
    return (
      <main className="mobile-page bg-background flex min-h-dvh items-center justify-center px-4">
        <p className="text-text-secondary text-sm">주문 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mobile-page bg-background flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <h1 className="text-title-3 font-semibold">주문 정보를 불러오지 못했어요.</h1>
        <p className="text-text-secondary mt-2 text-sm">{errorMessage}</p>
        <button
          className="border-border mt-5 rounded-full border px-4 py-2"
          onClick={onRetry}
          type="button"
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    <OrderSheet
      cartId={cartId}
      items={orderItems}
      orderReturnTo={orderReturnTo}
      selectedCartItemIds={getSelectedCartItemIds(orderItems)}
    />
  );
}
