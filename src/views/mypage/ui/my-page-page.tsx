'use client';

import { Bookmark, ChevronRight, Heart, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getMyProfile } from '@/entities/user/api/get-my-profile';
import { logout } from '@/features/auth/api/logout';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

import { getMyPageAccessRoute } from '../model/my-page-access';
import { getMyPageDisplayName } from '../model/my-page-profile';

const appEntryStorageKey = 'ai-pantry:entered-app';

/** 온보딩 미완료 로그인 사용자만 홈의 설정 안내로 이동할 수 있습니다. */
export function getOnboardingSetupHref(state: string) {
  return state === 'onboarding' ? '/' : null;
}

const activityItems = [
  { href: '/mypage/orders', icon: FileText, label: '주문 내역' },
  { href: '/mypage/favorites', icon: Heart, label: '찜한 상품' },
  { href: '/mypage/scraps', icon: Bookmark, label: '스크랩 레시피' },
] as const;

const accountItems = [
  { href: '/mypage/edit', label: '회원 정보 관리' },
  { href: '/mypage/delivery', label: '배송지 관리' },
  { href: '/onboarding', label: '개인화 설정' },
  { href: '/mypage/orders/cancel', label: '취소/환불 요청' },
] as const;

const supportItems = [
  { label: '고객센터' },
  { label: '공지사항' },
  { label: '자주 하는 질문' },
] as const;

function SettingsRow({
  href,
  label,
  destructive = false,
  onClick,
}: {
  href?: string;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className={destructive ? 'text-destructive' : 'text-text-secondary'}>{label}</span>
      {href ? <ChevronRight aria-hidden="true" className="text-text-secondary size-6" /> : null}
    </>
  );
  const className =
    'border-border flex h-10 items-center justify-between rounded-[10px] border pl-4 pr-2 text-sm leading-5 font-medium';

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <button className={`${className} w-full text-left`} onClick={onClick} type="button">
      {content}
    </button>
  );
}

function MyPageLoading() {
  return (
    <main className="mobile-page bg-background min-h-dvh" role="status">
      <span className="sr-only">마이페이지를 불러오는 중입니다.</span>
    </main>
  );
}

export function MyPagePage() {
  const router = useRouter();
  const { state, setGuestState } = useAuthSession();
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const redirectPath = isLoggingOut ? null : getMyPageAccessRoute(state);
  const [logoutError, setLogoutError] = useState(false);
  const displayName = getMyPageDisplayName(nickname);
  const onboardingSetupHref = getOnboardingSetupHref(state);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(false);

    try {
      await logout();
      setGuestState();
      window.sessionStorage.setItem(appEntryStorageKey, 'true');
      router.replace('/');
    } catch {
      setLogoutError(true);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (redirectPath) router.replace(redirectPath);
  }, [redirectPath, router]);

  useEffect(() => {
    if (state === 'guest' || state === 'loading') return;

    let isMounted = true;

    void getMyProfile()
      .then((profile) => {
        if (isMounted) setNickname(profile.nickname);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [state]);

  if (state === 'loading') return <MyPageLoading />;
  if (redirectPath) return null;

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col overflow-x-clip">
      <section
        className="flex flex-col items-center bg-[var(--primitive-primary-400)] py-8"
        aria-label="내 프로필"
      >
        <div className="relative grid size-25 place-items-center rounded-full bg-[var(--primitive-primary-200)] p-1">
          <Image alt="기본 프로필" height={22} src="/images/mypage/profile-face.png" width={45} />
          <Link
            aria-label="프로필 편집"
            className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full bg-[var(--primitive-secondary-600)]"
            type="button"
            href="/mypage/edit"
          >
            <Image
              alt=""
              aria-hidden="true"
              height={16}
              src="/images/mypage/profile-edit.png"
              width={16}
            />
          </Link>
        </div>
        <p className="mt-4 text-base leading-6 font-medium [color:var(--primitive-primary-900)]">
          안녕하세요!
        </p>
        <p aria-busy={!displayName} className="text-lg leading-7">
          {displayName ? <strong className="font-semibold">{displayName}</strong> : null}님
        </p>
      </section>

      <div className="flex flex-1 flex-col gap-2 py-4">
        {onboardingSetupHref ? (
          <section className="mx-4 rounded-xl border-[1.5px] border-solid !border-[color:var(--primitive-primary-500)] bg-[var(--primitive-primary-100)] p-4">
            <h1 className="text-base leading-6 font-semibold">아직 등록된 정보가 없어요</h1>
            <p className="text-text-secondary text-sm leading-5 font-medium">
              맞춤 레시피를 받기 위해 설정이 필요해요
            </p>
            <Link
              className="bg-primary mt-4 flex h-10 items-center justify-center rounded-xl text-base leading-6 font-semibold"
              href={onboardingSetupHref}
            >
              설정하기
            </Link>
          </section>
        ) : null}

        <section className="px-4 py-2" aria-labelledby="activity-title">
          <h2 className="text-base leading-6 font-semibold" id="activity-title">
            나의 활동
          </h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {activityItems.map(({ href, icon: Icon, label }) => {
              const content = (
                <>
                  <Icon
                    aria-hidden="true"
                    className="size-7 text-[var(--primitive-primary-700)]"
                    strokeWidth={1.5}
                  />
                  <span className="text-text-secondary text-sm leading-5 font-medium">{label}</span>
                </>
              );
              const className =
                'bg-[var(--primitive-primary-100)] flex min-h-[98px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3';

              return href ? (
                <Link className={className} href={href} key={label}>
                  {content}
                </Link>
              ) : (
                <button className={className} key={label} type="button">
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-2" aria-labelledby="account-title">
          <h2 className="text-base leading-6 font-semibold" id="account-title">
            내 정보 관리
          </h2>
          <div className="mt-2 space-y-2">
            {accountItems.map((item) => (
              <SettingsRow {...item} key={item.label} />
            ))}
          </div>
        </section>

        <section className="px-4 py-2" aria-labelledby="support-title">
          <h2 className="text-base leading-6 font-semibold" id="support-title">
            고객 지원
          </h2>
          <div className="mt-2 space-y-2">
            {supportItems.map((item) => (
              <SettingsRow {...item} key={item.label} />
            ))}
          </div>
        </section>

        <section className="px-4 py-2" aria-label="계정">
          <div className="space-y-2">
            <SettingsRow label="로그아웃" onClick={() => setIsLogoutSheetOpen(true)} />
            <SettingsRow destructive label="회원 탈퇴" />
          </div>
        </section>
      </div>
      <BottomNavigation />
      {isLogoutSheetOpen ? (
        <div
          aria-label="로그아웃 확인"
          aria-modal="true"
          className="bg-overlay/70 fixed inset-0 z-30 flex items-end"
          onClick={() => !isLoggingOut && setIsLogoutSheetOpen(false)}
          role="dialog"
        >
          <section
            className="bg-background mx-auto flex w-full max-w-[var(--layout-mobile-design-frame)] flex-col items-center gap-2 overflow-hidden rounded-t-[20px] pt-4 pb-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-8 w-full justify-center pt-2">
              <div className="bg-surface-inverse h-[5px] w-20 rounded-[100px]" />
            </div>
            <div className="flex w-full flex-col items-center gap-1 px-4 pt-5 pb-8 text-center">
              <h2 className="text-lg leading-7 font-semibold">로그아웃 하시겠어요?</h2>
              <p className="text-text-secondary text-base leading-6 font-medium">
                언제든지 다시 로그인할 수 있어요
              </p>
              {logoutError ? (
                <p className="text-destructive mt-3 text-sm">
                  로그아웃에 실패했어요. 다시 시도해 주세요.
                </p>
              ) : null}
            </div>
            <div className="grid w-full grid-cols-2 gap-2 px-4">
              <button
                className="bg-surface-disabled text-foreground h-12 min-w-24 rounded-full text-lg leading-7 font-semibold disabled:opacity-60"
                disabled={isLoggingOut}
                onClick={() => setIsLogoutSheetOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="bg-primary text-foreground h-12 min-w-24 rounded-full text-lg leading-7 font-semibold disabled:opacity-60"
                disabled={isLoggingOut}
                onClick={() => void handleLogout()}
                type="button"
              >
                {isLoggingOut ? '로그아웃 중' : '로그아웃'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
