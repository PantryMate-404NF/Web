import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { HomeBottomNavigation } from '@/widgets/home/ui/home-bottom-navigation';
import { HomeHeader } from '@/widgets/home/ui/home-header';
import { HomeProductRail } from '@/widgets/home/ui/home-product-rail';

export type HomeMockState = 'login' | 'onboarding' | 'complete';

export function getHomeMockState(state?: string): HomeMockState {
  if (state === 'login' || state === 'onboarding' || state === 'complete') return state;

  return 'complete';
}

function LoginHome() {
  return (
    <main className="bg-background mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-4 pt-16 pb-16">
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
        <Link
          className="text-label-2 flex h-13 items-center justify-center rounded-lg bg-[#fee500] font-semibold"
          href="/?state=onboarding"
        >
          <Image
            alt=""
            className="mr-auto ml-5 size-5"
            height={20}
            src="/images/auth/kakao-logo.svg"
            width={20}
          />
          <span className="mr-auto">카카오 로그인</span>
        </Link>
        <Link
          className="text-label-2 flex h-13 items-center justify-center rounded-lg bg-[#03a94d] font-semibold text-[var(--primitive-white)]"
          href="/?state=onboarding"
        >
          <Image
            alt=""
            className="mr-auto ml-5 size-5"
            height={20}
            src="/images/auth/naver-logo.svg"
            width={20}
          />
          <span className="mr-auto">네이버 로그인</span>
        </Link>
      </div>
      <Link
        className="text-label-2 text-muted-foreground mt-20 text-center"
        href="/?state=complete"
      >
        홈 둘러보기
      </Link>
    </main>
  );
}

function RecipeRail() {
  const recipes = ['간장 불고기', '채소 두부 찜', '닭가슴살 샐러드'];

  return (
    <section className="px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-label-3 font-semibold">나를 위한 레시피</h2>
        <Link className="text-label-4 text-muted-foreground flex items-center" href="/recipe">
          더보기 <ChevronRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
      <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
        {recipes.map((recipe) => (
          <Link className="w-[120px] shrink-0" href="/recipe" key={recipe}>
            <div aria-label={`${recipe} 이미지`} className="bg-muted h-[82px] rounded" role="img" />
            <p className="mt-1 text-xs font-semibold">{recipe}</p>
            <p className="text-label-4 text-muted-foreground mt-0.5 truncate">
              보유 재료로 맛있게 즐겨보세요.
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomeContent({ hasCompletedOnboarding }: { hasCompletedOnboarding: boolean }) {
  return (
    <main className="bg-background mx-auto flex min-h-dvh w-full max-w-[390px] flex-col">
      <HomeHeader />
      <div className="text-label-4 flex [scrollbar-width:none] gap-3 overflow-x-auto px-4 py-2 font-medium">
        {['오늘의 채소', '베스트', '간편식', '계란·유제품', '빵·과일', '건강식'].map((category) => (
          <span className="shrink-0" key={category}>
            {category}
          </span>
        ))}
      </div>
      <div className="bg-muted mx-4 mt-1 h-[184px]" />
      <div className="bg-border mx-4 mt-2 h-12" />
      <div className="flex flex-1 flex-col gap-7 py-6">
        {hasCompletedOnboarding ? <RecipeRail /> : null}
        <HomeProductRail description="꼭 먹어야 할 식재료" title="지금 가장 많이 담는 TOP 10" />
        <HomeProductRail
          description="봄 제철 식재료로 식단의 봄을 만나보세요"
          title="이달의 제철 식재료"
        />
        <HomeProductRail
          description="저장·보관법·비법 음식은 이런 재료로 만들어요."
          title="요즘 주목받는 재료"
        />
      </div>
      <HomeBottomNavigation />
      {hasCompletedOnboarding ? (
        <p className="text-label-4 bg-muted text-muted-foreground shadow-1 pointer-events-none fixed top-11 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-1.5">
          맛 선호도를 반영해 AI가 추천했어요.
        </p>
      ) : null}
    </main>
  );
}

export function HomePage({ state }: { state?: string }) {
  const homeState = getHomeMockState(state);

  if (homeState === 'login') return <LoginHome />;

  return <HomeContent hasCompletedOnboarding={homeState === 'complete'} />;
}
