'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { buildAddressListHref, type DeliveryAddressInput } from '@/entities/address/model/address';
import { useAddressStore } from '@/entities/address/model/address-store';

const EMPTY_FORM: DeliveryAddressInput = {
  recipientName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  isDefault: false,
};

function RequiredLabel({ children, htmlFor }: { children: string; htmlFor: string }) {
  return (
    <label className="flex items-start gap-0.5 text-base leading-6 font-medium" htmlFor={htmlFor}>
      {children}
      <Image
        alt=""
        aria-hidden="true"
        className="h-3 w-1.5"
        height={12}
        src="/icons/address/required.svg"
        width={6}
      />
    </label>
  );
}

const inputClassName =
  'border-border bg-surface-secondary text-text-secondary focus:border-primary focus:bg-[var(--primitive-primary-200)] h-12 w-full rounded-xl border px-4 text-base leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed';

export function AddressFormPage({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const addAddress = useAddressStore((state) => state.addAddress);
  const [form, setForm] = useState(EMPTY_FORM);
  const recipientId = useId();
  const phoneId = useId();
  const postalCodeId = useId();
  const addressId = useId();
  const detailAddressId = useId();
  const defaultAddressId = useId();
  const listHref = buildAddressListHref(returnTo);
  const canSubmit = Object.entries(form)
    .filter(([key]) => key !== 'isDefault')
    .every(([, value]) => String(value).trim().length > 0);

  function updateField<Key extends keyof DeliveryAddressInput>(
    key: Key,
    value: DeliveryAddressInput[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function handlePostalCodeSearch() {
    setForm((currentForm) => ({
      ...currentForm,
      postalCode: '13485',
      addressLine1: '서울특별시 신선하구 맛있동 425',
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    addAddress({ ...form, id: crypto.randomUUID() });
    router.replace(listHref);
  }

  return (
    <main className="mobile-page bg-background min-h-dvh">
      <header className="relative flex h-16 items-center justify-end pr-0.5">
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">
          배송지 추가
        </h1>
        <Link
          aria-label="배송지 추가 닫기"
          className="focus-visible:ring-ring grid size-10 place-items-center rounded-full focus-visible:ring-2"
          href={listHref}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-[14px]"
            height={14}
            src="/icons/pantry/calendar-close.svg"
            width={14}
          />
        </Link>
      </header>

      <form className="mx-auto w-[358px] max-w-[calc(100%-2rem)] pt-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <RequiredLabel htmlFor={recipientId}>받으시는 분</RequiredLabel>
            <input
              autoComplete="name"
              className={inputClassName}
              id={recipientId}
              onChange={(event) => updateField('recipientName', event.target.value)}
              placeholder="이름을 입력해주세요."
              value={form.recipientName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RequiredLabel htmlFor={phoneId}>휴대폰 번호</RequiredLabel>
            <input
              autoComplete="tel"
              className={inputClassName}
              id={phoneId}
              inputMode="tel"
              onChange={(event) => updateField('phoneNumber', event.target.value)}
              placeholder="휴대폰 번호를 입력해주세요."
              value={form.phoneNumber}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RequiredLabel htmlFor={postalCodeId}>주소</RequiredLabel>
          <div className="flex gap-2">
            <input
              aria-label="우편번호"
              className={`${inputClassName} min-w-0 flex-1`}
              id={postalCodeId}
              readOnly
              value={form.postalCode}
            />
            <button
              className="border-border-strong focus-visible:ring-ring h-12 w-[171px] shrink-0 rounded-xl border text-base leading-6 font-semibold focus-visible:ring-2"
              onClick={handlePostalCodeSearch}
              type="button"
            >
              우편번호 검색
            </button>
          </div>
          <input
            aria-label="기본 주소"
            className={inputClassName}
            id={addressId}
            readOnly
            value={form.addressLine1}
          />
          <input
            autoComplete="address-line2"
            className={`${inputClassName} bg-background`}
            id={detailAddressId}
            onChange={(event) => updateField('addressLine2', event.target.value)}
            placeholder="상세 주소를 입력해주세요."
            value={form.addressLine2}
          />

          <label
            className="text-text-secondary mt-0 flex w-fit items-center gap-1 text-sm leading-[21px] font-medium"
            htmlFor={defaultAddressId}
          >
            <input
              checked={form.isDefault}
              className="peer sr-only"
              id={defaultAddressId}
              onChange={(event) => updateField('isDefault', event.target.checked)}
              type="checkbox"
            />
            <span
              aria-hidden="true"
              className={`${form.isDefault ? 'bg-primary' : 'bg-surface-disabled'} peer-focus-visible:ring-ring grid size-[22px] place-items-center rounded-full peer-focus-visible:ring-2`}
            >
              <Image
                alt=""
                className={form.isDefault ? 'h-[10px] w-[14.23px]' : 'h-[6.66px] w-[9.49px]'}
                height={form.isDefault ? 10 : 7}
                src={
                  form.isDefault
                    ? '/icons/address/check-selected.svg'
                    : '/icons/address/check-disabled.svg'
                }
                width={form.isDefault ? 14 : 10}
              />
            </span>
            기본 배송지로 설정
          </label>
        </div>

        <footer className="mt-[159px] flex w-full gap-2">
          <Link
            className="bg-surface-secondary text-text-tertiary focus-visible:ring-ring flex h-15 flex-1 items-center justify-center rounded-xl text-lg leading-7 font-semibold focus-visible:ring-2"
            href={listHref}
          >
            취소
          </Link>
          <button
            className="bg-primary text-primary-foreground focus-visible:ring-ring disabled:bg-surface-disabled disabled:text-disabled h-15 flex-1 rounded-xl text-lg leading-7 font-semibold focus-visible:ring-2"
            disabled={!canSubmit}
            type="submit"
          >
            확인
          </button>
        </footer>
      </form>
    </main>
  );
}
