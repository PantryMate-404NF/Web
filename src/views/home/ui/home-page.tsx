'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { HOME_PRODUCT_SECTIONS } from '@/widgets/home/model/home-content';
import { HomeHeader } from '@/widgets/home/ui/home-header';
import { HomeProductRail } from '@/widgets/home/ui/home-product-rail';
import { HomePromotionCarousel } from '@/widgets/home/ui/home-promotion-carousel';
import { HomeRecipeRail } from '@/widgets/home/ui/home-recipe-rail';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

import { HomePantryReminder } from './home-pantry-reminder';

export const HOME_CATEGORIES = [
  '오늘의 채소',
  '베스트',
  '간편식',
  '계란 · 알류',
  '쌀 · 잡곡 · 견과',
  '돼지고기 · 소고기',
  '생선 · 해산물 · 건어물',
  '소스 · 양념',
] as const;

export type HomeMockState = 'guest' | 'onboarding' | 'complete';

/** 목업에서 로그인·온보딩 완료 여부에 따라 홈 화면을 구분합니다. */
export function getHomeMockState(
  state?: string,
  restoredSessionState?: Exclude<HomeMockState, 'guest'>,
): HomeMockState {
  if (restoredSessionState) return restoredSessionState;
  if (state === 'complete' || state === 'onboarding') return state;
  return 'guest';
}

export function getOnboardingHref(state: HomeMockState) {
  return state === 'guest' ? '/login' : '/onboarding';
}

export function HomeCategoryNavigation() {
  return (
    <ul
      aria-label="상품 카테고리"
      className="text-title-4 mx-4 flex h-11 w-[calc(100%-2rem)] shrink-0 [scrollbar-width:none] items-center gap-4 overflow-x-auto font-medium"
    >
      {HOME_CATEGORIES.map((category) => (
        <li className="shrink-0" key={category}>
          {category}
        </li>
      ))}
    </ul>
  );
}

function RecommendationTooltip() {
  return (
    <p className="bg-surface-inverse text-text-inverse shadow-card pointer-events-none absolute top-[239px] left-1/2 z-10 flex w-[269px] max-w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center rounded-full px-5 py-2 text-base leading-6 font-medium whitespace-nowrap min-[390px]:left-[98px] min-[390px]:translate-x-0">
      <span
        aria-hidden="true"
        className="bg-surface-inverse absolute top-[26px] left-[14px] size-4 rotate-45 rounded-[3px]"
      />
      <span className="relative">맛 선호도를 반영해 AI가 추천했어요.</span>
    </p>
  );
}

function OnboardingPrompt({ href }: { href: string }) {
  return (
    <section className="mx-4 mt-4 flex h-22 items-center gap-4 rounded-xl p-4 [background:var(--primitive-secondary-300)]">
      <div className="flex h-15 min-w-0 flex-1 flex-col items-start gap-0.5">
        <h2 className="text-title-4 w-full truncate font-bold [color:var(--primitive-secondary-800)]">
          나를 위한 레시피를 찾아볼까요?
        </h2>
        <p className="text-sm leading-[21px] font-medium [color:var(--primitive-secondary-700)]">
          AI가 레시피를 추천해 드려요.
        </p>
      </div>
      <div className="flex h-15 shrink-0 flex-col items-end justify-end">
        <Link
          className="bg-background focus-visible:ring-ring flex shrink-0 items-center rounded-full py-1.5 pr-2.5 pl-4 text-sm leading-[21px] font-semibold [color:var(--primitive-secondary-800)] focus-visible:ring-2"
          href={href}
        >
          온보딩 하기
          <Image
            alt=""
            aria-hidden="true"
            height={20}
            src="/icons/home/chevron-right.svg"
            width={20}
          />
        </Link>
      </div>
    </section>
  );
}

function HomeContent({
  forceReminder,
  homeState,
}: {
  forceReminder: boolean;
  homeState: HomeMockState;
}) {
  const hasCompletedOnboarding = homeState === 'complete';

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col overflow-x-clip">
      <HomeHeader />
      <HomeCategoryNavigation />
      <div className="relative">
        <HomePromotionCarousel />
        {hasCompletedOnboarding ? <RecommendationTooltip /> : null}
      </div>
      {hasCompletedOnboarding ? (
        <div className="mt-4">
          <HomeRecipeRail />
        </div>
      ) : (
        <OnboardingPrompt href={getOnboardingHref(homeState)} />
      )}
      <div className="flex flex-1 flex-col gap-6 pt-6 pb-6">
        {HOME_PRODUCT_SECTIONS.map((section) => (
          <HomeProductRail key={section.id} {...section} />
        ))}
      </div>
      <BottomNavigation />
      {hasCompletedOnboarding ? <HomePantryReminder forceOpen={forceReminder} /> : null}
    </main>
  );
}

export function HomePage({
  forceReminder = false,
  state,
}: {
  forceReminder?: boolean;
  state?: string;
}) {
  const { state: sessionState } = useAuthSession();
  const restoredSessionState =
    sessionState === 'complete' || sessionState === 'onboarding' ? sessionState : undefined;
  const homeState = getHomeMockState(
    sessionState === 'loading' ? state : undefined,
    restoredSessionState,
  );

  return <HomeContent forceReminder={forceReminder} homeState={homeState} />;
}
