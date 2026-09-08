import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';
import { HomeHeader } from '@/widgets/home/ui/home-header';
import { HomeProductRail } from '@/widgets/home/ui/home-product-rail';

export const HOME_CATEGORIES = [
  '오늘의 채소',
  '베스트',
  '간편식',
  '계란 · 알류',
  '쌀 · 잡곡 · 견과',
  '돼지고기 · 소고기',
] as const;

export type HomeMockState = 'onboarding' | 'complete';

/** 목업에서 로그인·온보딩 완료 여부에 따라 홈 화면을 구분합니다. */
export function getHomeMockState(state?: string): HomeMockState {
  return state === 'complete' ? 'complete' : 'onboarding';
}

function RecipeRail() {
  const recipes = ['간장 불고기', '채소 두부 찜', '닭가슴살 샐러드'];

  return (
    <section className="bg-muted mx-4 pt-3 pb-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-label-3 font-semibold">나를 위한 레시피</h2>
        <Link
          className="text-text-secondary flex items-center text-base font-medium"
          href="/recipe"
        >
          더보기 <ChevronRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
      <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
        {recipes.map((recipe) => (
          <Link className="w-[156px] shrink-0" href="/recipe" key={recipe}>
            <div aria-label={`${recipe} 이미지`} className="bg-border h-24 rounded-lg" role="img" />
            <p className="text-body-4 mt-2 truncate font-semibold">{recipe}</p>
            <p className="text-label-4 text-muted-foreground mt-1 truncate">
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
    <main className="mobile-page bg-background flex flex-col">
      <HomeHeader isAuthenticated={hasCompletedOnboarding} />
      <div className="text-title-4 flex h-11 [scrollbar-width:none] items-center gap-4 overflow-x-auto px-4 font-medium">
        {HOME_CATEGORIES.map((category) => (
          <span className="shrink-0" key={category}>
            {category}
          </span>
        ))}
      </div>
      <div className="relative mx-4">
        <div aria-label="프로모션 배너" className="h-64 w-89 bg-gray-800" role="img" />
        {hasCompletedOnboarding ? (
          <p className="text-label-2 bg-border text-muted-foreground shadow-1 pointer-events-none absolute bottom-[-20px] left-1/2 z-10 -translate-x-1/2 rounded-full px-5 py-2 font-medium whitespace-nowrap">
            <span
              aria-hidden="true"
              className="bg-border absolute top-[26px] left-[14px] z-0 size-4 rotate-45 rounded-[3px]"
            />
            <span className="relative z-10">맛 선호도를 반영해 AI가 추천했어요.</span>
          </p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-12 pt-4 pb-6">
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
      <BottomNavigation isAuthenticated={hasCompletedOnboarding} />
    </main>
  );
}

export function HomePage({ state }: { state?: string }) {
  const homeState = getHomeMockState(state);

  return <HomeContent hasCompletedOnboarding={homeState === 'complete'} />;
}
