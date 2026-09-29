import Image from 'next/image';
import Link from 'next/link';

import {
  buildAddressEditHref,
  buildAddressFormHref,
  deliveryAddressMocks,
  type DeliveryAddress,
} from '@/entities/address/model/address';

function AddressDetails({ address }: { address: DeliveryAddress }) {
  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-base leading-6 font-semibold">{address.recipientName}</h2>
            {address.isDefault ? (
              <span className="bg-surface-secondary text-text-secondary text-gnb shrink-0 rounded-lg px-2 py-0.5 leading-[17px] font-semibold">
                기본배송지
              </span>
            ) : null}
          </div>
          <p className="truncate text-sm leading-[21px] font-medium">{address.phoneNumber}</p>
        </div>
        <p className="text-text-secondary line-clamp-2 h-[42px] shrink-0 text-sm leading-[21px] font-medium">
          {address.addressLine1} {address.addressLine2} ({address.postalCode})
        </p>
      </div>
    </>
  );
}

function AddressCard({
  address,
  onSelect,
  returnTo,
}: {
  address: DeliveryAddress;
  onSelect?: (addressId: string) => Promise<void> | void;
  returnTo?: string;
}) {
  const cardClassName =
    'border-border focus-visible:ring-ring flex h-[137px] w-full items-end gap-8 rounded-xl border px-4 py-5 text-left focus-visible:ring-2';

  if (returnTo) {
    return (
      <button
        className={cardClassName}
        disabled={!onSelect}
        onClick={() => void onSelect?.(address.id)}
        type="button"
      >
        <AddressDetails address={address} />
        <span className="text-text-tertiary flex size-10 shrink-0 items-end justify-center self-end text-[13px] leading-5 font-bold">
          선택
        </span>
      </button>
    );
  }

  return (
    <article className={cardClassName}>
      <AddressDetails address={address} />
      <Link
        aria-label={`${address.recipientName} 배송지 수정`}
        className="text-text-tertiary focus-visible:ring-ring flex size-10 shrink-0 items-end justify-center self-end rounded-sm text-[13px] leading-5 font-bold focus-visible:ring-2"
        href={buildAddressEditHref(address.id, returnTo)}
      >
        수정
      </Link>
    </article>
  );
}

function EmptyAddressState() {
  return (
    <section className="flex h-[578px] w-full items-center justify-center" role="status">
      <div className="flex w-[184px] -translate-y-[5px] flex-col items-center gap-3.5">
        <Image
          alt=""
          aria-hidden="true"
          className="size-[54.25px]"
          height={54.25}
          src="/icons/address/empty.svg"
          width={54.25}
        />
        <p className="text-body-3 text-text-tertiary font-semibold">등록된 배송지가 없어요</p>
      </div>
    </section>
  );
}

function AddAddressLink({ returnTo }: { returnTo?: string }) {
  return (
    <Link
      className="focus-visible:ring-ring flex h-[60px] w-full items-center justify-center rounded-xl pr-3 text-base leading-6 font-semibold focus-visible:ring-2"
      href={buildAddressFormHref(returnTo)}
    >
      <span className="grid size-10 place-items-center">
        <Image alt="" aria-hidden="true" height={24} src="/icons/home/plus.svg" width={24} />
      </span>
      배송지 추가
    </Link>
  );
}

export function AddressListPage({
  addresses = deliveryAddressMocks,
  errorMessage,
  isLoading = false,
  isUnauthorized = false,
  onRetry,
  onSelect,
  returnTo,
  selectionErrorMessage,
}: {
  addresses?: readonly DeliveryAddress[];
  errorMessage?: string;
  isLoading?: boolean;
  isUnauthorized?: boolean;
  onRetry?: () => void;
  onSelect?: (addressId: string) => Promise<void> | void;
  returnTo?: string;
  selectionErrorMessage?: string;
}) {
  let content;

  if (isLoading) {
    content = (
      <section className="flex h-[578px] items-center justify-center" role="status">
        <p className="text-text-secondary text-sm">배송지 목록을 불러오는 중이에요.</p>
      </section>
    );
  } else if (isUnauthorized) {
    content = (
      <section className="flex h-[578px] flex-col items-center justify-center text-center">
        <p className="text-text-secondary text-sm">로그인 후 배송지를 관리해 주세요.</p>
        <Link
          className="bg-primary text-primary-foreground mt-5 rounded-xl px-5 py-3"
          href="/login"
        >
          로그인하기
        </Link>
      </section>
    );
  } else if (errorMessage) {
    content = (
      <section
        className="flex h-[578px] flex-col items-center justify-center text-center"
        role="alert"
      >
        <h2 className="text-title-3 font-semibold">배송지 목록을 불러오지 못했어요.</h2>
        <p className="text-text-secondary mt-2 text-sm">{errorMessage}</p>
        {onRetry ? (
          <button
            className="border-border mt-5 rounded-full border px-4 py-2"
            onClick={onRetry}
            type="button"
          >
            다시 시도
          </button>
        ) : null}
      </section>
    );
  } else if (addresses.length > 0) {
    content = (
      <div className="flex flex-col gap-5 pt-3">
        {selectionErrorMessage ? (
          <p className="text-destructive text-sm" role="alert">
            {selectionErrorMessage}
          </p>
        ) : null}
        <section aria-label="등록된 배송지 목록" className="flex flex-col gap-3">
          {addresses.map((address) => (
            <AddressCard
              address={address}
              key={address.id}
              onSelect={onSelect}
              returnTo={returnTo}
            />
          ))}
        </section>
        <AddAddressLink returnTo={returnTo} />
      </div>
    );
  } else {
    content = (
      <>
        <EmptyAddressState />
        <AddAddressLink returnTo={returnTo} />
      </>
    );
  }

  return (
    <main className="mobile-page bg-background min-h-dvh">
      <header className="relative flex h-16 items-center px-2">
        <Link
          aria-label={returnTo ? '주문서로 돌아가기' : '마이페이지로 돌아가기'}
          className="focus-visible:ring-ring grid size-10 place-items-center rounded-full focus-visible:ring-2"
          href={returnTo ?? '/mypage'}
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/icons/navigation/back.svg"
            width={24}
          />
        </Link>
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">
          배송지 목록
        </h1>
      </header>

      <div className="mx-auto w-[358px] max-w-[calc(100%-2rem)]">{content}</div>
    </main>
  );
}
