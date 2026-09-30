'use client';

import Image from 'next/image';

import { saveLoginReturnTo } from '@/features/auth/model/login-return-to';

export function SocialLoginLink({
  className,
  href,
  iconSrc,
  label,
  returnTo,
}: {
  className: string;
  href: string;
  iconSrc: string;
  label: string;
  returnTo?: string;
}) {
  return (
    <a
      className={`text-label-2 relative flex h-14 w-full items-center rounded-md px-5 font-semibold ${className}`}
      href={href}
      onClick={() => saveLoginReturnTo(window.sessionStorage, returnTo)}
    >
      <Image alt="" className="size-5" height={20} src={iconSrc} width={20} />
      <span className="absolute inset-0 grid place-items-center">{label}</span>
    </a>
  );
}
