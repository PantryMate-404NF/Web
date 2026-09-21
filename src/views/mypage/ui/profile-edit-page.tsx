'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMyProfile } from '@/entities/user/api/get-my-profile';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { ApiError } from '@/shared/api/api-error';

import { getMyPageAccessRoute } from '../model/my-page-access';

interface ProfileFormState {
  nickname: string;
  birthDate: string;
  phoneNumber: string;
}

export function ProfileEditPage() {
  const router = useRouter();
  const { state, setGuestState } = useAuthSession();
  const [form, setForm] = useState<ProfileFormState>({
    nickname: '',
    birthDate: '',
    phoneNumber: '',
  });
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const redirectPath = getMyPageAccessRoute(state);

  useEffect(() => {
    if (redirectPath) router.replace(redirectPath);
  }, [redirectPath, router]);

  useEffect(() => {
    if (state === 'guest' || state === 'loading') return;

    let isMounted = true;

    void getMyProfile()
      .then((profile) => {
        if (!isMounted) return;

        setForm({
          nickname: profile.nickname ?? '',
          birthDate: profile.birthDate ?? '',
          phoneNumber: profile.phoneNumber ?? '',
        });
        setEmail(profile.email ?? '');
      })
      .catch((error: unknown) => {
        if (!isMounted) return;

        if (error instanceof ApiError && error.status === 401) {
          setGuestState();
          router.replace('/login');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router, setGuestState, state]);

  function handleChange(field: keyof ProfileFormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit() {
    router.back();
  }

  if (state === 'loading' || isLoading) {
    return <main className="mobile-page bg-background min-h-dvh" />;
  }

  if (redirectPath) return null;

  return (
    <main className="mobile-page bg-background text-foreground relative flex min-h-dvh flex-col overflow-x-hidden">
      <header className="relative flex h-16 shrink-0 items-center">
        <button
          aria-label="이전 페이지"
          className="grid size-10 place-items-center"
          onClick={() => router.back()}
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/images/mypage/back-arrow.svg"
            width={24}
          />
        </button>
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">회원 수정</h1>
      </header>
      <div className="flex flex-1 flex-col px-4">
        <section className="bg-surface-default relative mt-4 flex flex-col items-center gap-4 rounded-[10px] border-[1.5px] border-[var(--primitive-grey-200)] p-4">
          <div className="grid size-20 place-items-center rounded-full bg-[var(--primitive-primary-200)] p-1">
            <Image
              alt="프로필 이미지"
              height={20}
              src="/images/mypage/profile-face.svg"
              width={40}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-base leading-6 font-semibold">{form.nickname}</p>
            <p className="text-[15px] leading-[22.5px] text-[var(--primitive-grey-600)]">{email}</p>
          </div>
          <button
            aria-label="프로필 이미지 수정"
            className="absolute top-[10px] right-[10px] grid size-9 place-items-center"
            type="button"
          >
            <Image
              alt=""
              aria-hidden="true"
              height={32}
              src="/images/mypage/profile-edit.svg"
              width={32}
            />
          </button>
        </section>
        <section className="mt-4 flex flex-col gap-6 py-4">
          <ProfileField
            label="이름"
            onChange={(value) => handleChange('nickname', value)}
            value={form.nickname}
          />
          <ProfileField
            label="생년월일"
            onChange={(value) => handleChange('birthDate', value)}
            placeholder="2000-01-01"
            value={form.birthDate}
          />
          <ProfileField
            label="휴대폰 번호"
            onChange={(value) => handleChange('phoneNumber', value)}
            placeholder="010-1234-2222"
            value={form.phoneNumber}
          />
        </section>
      </div>
      <div className="bg-background mt-auto shrink-0 px-4 pt-4 pb-14">
        <button
          className="text-title-3 h-[60px] w-full rounded-xl bg-[var(--primitive-primary-500)] font-semibold"
          onClick={handleSubmit}
          type="button"
        >
          수정 완료
        </button>
      </div>
    </main>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function ProfileField({ label, value, placeholder, onChange }: ProfileFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-base leading-6 font-medium">{label}</span>
      <input
        className="border-primary focus:border-primary h-12 w-full rounded-xl border bg-[var(--primitive-primary-200)] px-4 text-base leading-6 text-[var(--primitive-grey-600)] transition-colors outline-none"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}
