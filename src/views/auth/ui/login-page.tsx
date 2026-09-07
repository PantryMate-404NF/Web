/** 카카오·네이버 소셜 로그인을 시작하는 독립 로그인 화면입니다. */
import Image from 'next/image';
import Link from 'next/link';

import { getSocialLoginPath } from '../model/social-login';

const loginProviders = [
  {
    iconSrc: '/images/auth/kakao-logo.svg',
    label: '카카오로 시작하기',
    provider: 'kakao',
    className: 'bg-[#fee500] text-foreground',
  },
  {
    iconSrc: '/images/auth/naver-logo.svg',
    label: '네이버로 시작하기',
    provider: 'naver',
    className: 'bg-[#03a94d] text-[var(--primitive-white)]',
  },
] as const;

export function LoginPage() {
  return (
    <main className="mobile-page mobile-page--padded bg-background flex flex-col pt-16 pb-16">
      <div
        aria-label="서비스 대표 이미지 영역"
        className="bg-muted text-label-2 mx-auto mt-24 grid size-[180px] place-items-center text-center font-semibold"
        role="img"
      >
        이미지 영역
        <br />
        사이즈는 임시
      </div>
      <div className="mt-auto space-y-2">
        {loginProviders.map(({ className, iconSrc, label, provider }) => (
          <Link
            className={`text-label-2 flex h-13 items-center justify-center rounded-lg font-semibold ${className}`}
            href={getSocialLoginPath(provider)}
            key={provider}
          >
            <Image alt="" className="mr-auto ml-5 size-5" height={20} src={iconSrc} width={20} />
            <span className="mr-auto">{label}</span>
          </Link>
        ))}
      </div>
      <Link className="text-label-2 text-muted-foreground mt-20 text-center" href="/">
        홈 둘러보기
      </Link>
    </main>
  );
}
