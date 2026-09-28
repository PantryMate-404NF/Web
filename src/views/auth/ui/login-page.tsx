import Image from 'next/image';
import Link from 'next/link';

import { getSafeLoginReturnTo } from '@/features/auth/model/login-return-to';
import { getSocialLoginUrl } from '@/views/auth/model/social-login';

import { SocialLoginLink } from './social-login-link';

const loginProviders = [
  {
    iconSrc: '/images/auth/kakao-logo.svg',
    label: '카카오 로그인',
    provider: 'kakao',
    className: 'bg-provider-kakao text-foreground',
  },
  {
    iconSrc: '/images/auth/naver-logo.svg',
    label: '네이버 로그인',
    provider: 'naver',
    className: 'bg-provider-naver text-provider-naver-foreground',
  },
] as const;

export function LoginPage({ returnTo }: { returnTo?: string } = {}) {
  const safeReturnTo = getSafeLoginReturnTo(returnTo);

  return (
    <main className="mobile-page mobile-page--padded bg-background min-h-dvh pt-[calc(env(safe-area-inset-top)+12px)]">
      <header className="flex h-10 justify-end">
        <Link
          aria-label="로그인 닫기"
          className="grid size-10 place-items-center"
          href={safeReturnTo ?? '/'}
        >
          <Image alt="" height={40} priority src="/images/auth/close.svg" width={40} />
        </Link>
      </header>

      <section className="mt-[117px] flex flex-col items-center" aria-label="Pantry Mate 소개">
        <Image alt="" height={196} priority src="/images/logo/logo.svg" width={196} />
      </section>

      <div className="mt-[143px] space-y-1">
        {loginProviders.map(({ className, iconSrc, label, provider }) => (
          <SocialLoginLink
            className={className}
            href={getSocialLoginUrl(provider)}
            iconSrc={iconSrc}
            key={provider}
            label={label}
            returnTo={safeReturnTo}
          />
        ))}
      </div>

      <p className="text-label-3 text-disabled mt-11 text-center">
        서비스 이용약관과
        <br />
        개인정보처리방침을 확인하세요.
      </p>
    </main>
  );
}
