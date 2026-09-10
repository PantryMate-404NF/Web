'use client';

import Image from 'next/image';
import Link from 'next/link';

import { getSocialLoginUrl, type SocialLoginProvider } from '../model/social-login';

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

export function LoginPage() {
  /**
   * API Gateway URL은 정적 생성이 아닌 사용자 클릭 시점에 생성
   * 브라우저 이동을 사용해야 OAuth의 302 리다이렉트와 HttpOnly state 쿠키가 정상 동작
   */
  function startSocialLogin(provider: SocialLoginProvider) {
    window.location.assign(getSocialLoginUrl(provider));
  }

  return (
    <main className="mobile-page mobile-page--padded bg-background min-h-dvh pt-[calc(env(safe-area-inset-top)+12px)]">
      <header className="flex h-10 justify-end">
        <Link aria-label="로그인 닫기" className="grid size-10 place-items-center" href="/">
          <Image alt="" height={40} priority src="/images/auth/close.svg" width={40} />
        </Link>
      </header>

      <section className="mt-[117px] flex flex-col items-center" aria-label="Pantry Mate 소개">
        <Image alt="" height={172} priority src="/images/auth/login-profile.png" width={172} />
        <Image
          alt="Pantry Mate"
          className="mt-4"
          height={21}
          priority
          src="/images/auth/pantrymate-wordmark.svg"
          width={145}
        />
      </section>

      <div className="mt-[143px] space-y-1">
        {loginProviders.map(({ className, iconSrc, label, provider }) => (
          <button
            className={`text-label-2 relative flex h-14 w-full items-center rounded-md px-5 font-semibold ${className}`}
            key={provider}
            onClick={() => startSocialLogin(provider)}
            type="button"
          >
            <Image alt="" className="size-5" height={20} src={iconSrc} width={20} />
            <span className="absolute inset-0 grid place-items-center">{label}</span>
          </button>
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
