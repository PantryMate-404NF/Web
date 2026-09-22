import Image from 'next/image';
import Link from 'next/link';

import {
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
  onSelect?: (addressId: string) => void;
  returnTo?: string;
}) {
  const cardClassName =
    'border-border focus-visible:ring-ring flex h-[137px] w-full items-end gap-8 rounded-xl border px-4 py-5 text-left focus-visible:ring-2';

  if (returnTo) {
    return (
      <Link className={cardClassName} href={returnTo} onClick={() => onSelect?.(address.id)}>
        <AddressDetails address={address} />
        <span className="text-text-tertiary flex size-10 shrink-0 items-end justify-center self-end text-[13px] leading-5 font-bold">
          선택
        </span>
      </Link>
    );
  }

  return (
    <article className={cardClassName}>
      <AddressDetails address={address} />
      <button
        aria-label={`${address.recipientName} 배송지 수정 (준비 중)`}
        className="text-text-tertiary flex size-10 shrink-0 items-end justify-center self-end text-[13px] leading-5 font-bold"
        disabled
        type="button"
      >
        수정
      </button>
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
  onSelect,
  returnTo,
}: {
  addresses?: readonly DeliveryAddress[];
  onSelect?: (addressId: string) => void;
  returnTo?: string;
}) {
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

      <div className="mx-auto w-[358px] max-w-[calc(100%-2rem)]">
        {addresses.length > 0 ? (
          <div className="flex flex-col gap-5 pt-3">
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
        ) : (
          <>
            <EmptyAddressState />
            <AddAddressLink returnTo={returnTo} />
          </>
        )}
      </div>
    </main>
  );
}
