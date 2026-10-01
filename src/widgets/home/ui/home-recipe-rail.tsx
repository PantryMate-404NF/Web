import Image from 'next/image';
import Link from 'next/link';

import { ApiError } from '@/shared/api/api-error';

import type { HomeRecipeCardItem } from '../model/home-recipe';
import { HomeSectionHeading } from './home-section-heading';

interface HomeRecipeRailProps {
  description?: string;
  error?: Error | null;
  isPending?: boolean;
  onRetry?: () => void;
  recipes?: HomeRecipeCardItem[];
}

function RecipeRailState({
  children,
  role = 'status',
}: {
  children: React.ReactNode;
  role?: 'alert' | 'status';
}) {
  return (
    <div
      aria-live={role === 'status' ? 'polite' : undefined}
      className="text-text-secondary mt-3 mr-4 flex min-h-[164px] items-center justify-center rounded-lg bg-[var(--primitive-grey-50)] px-6 text-center text-sm leading-[21px]"
      role={role}
    >
      {children}
    </div>
  );
}

export function HomeRecipeRail({
  description = '맛 선호도를 반영해 AI가 추천했어요.',
  error = null,
  isPending = false,
  onRetry,
  recipes = [],
}: HomeRecipeRailProps) {
  const isRecommendationUnavailable = error instanceof ApiError && error.status === 503;

  return (
    <section className="pt-2.5 pb-4 pl-4 [background:var(--home-recipe-background)]">
      <HomeSectionHeading description={description} href="/recipe" title="나를 위한 레시피" />
      {isPending ? (
        <RecipeRailState>추천 레시피를 불러오는 중이에요.</RecipeRailState>
      ) : error ? (
        <RecipeRailState role="alert">
          <div>
            <p>
              {isRecommendationUnavailable
                ? '알레르기 정보를 확인할 수 없어 추천을 잠시 중단했어요.'
                : '추천 레시피를 불러오지 못했어요.'}
            </p>
            {onRetry ? (
              <button
                className="focus-visible:ring-ring mt-3 rounded-full px-4 py-2 font-semibold focus-visible:ring-2"
                onClick={onRetry}
                type="button"
              >
                다시 시도
              </button>
            ) : null}
          </div>
        </RecipeRailState>
      ) : recipes.length === 0 ? (
        <RecipeRailState>추천할 레시피를 준비 중이에요.</RecipeRailState>
      ) : (
        <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto">
          {recipes.map((recipe) => (
            <article className="w-[164px] shrink-0" key={recipe.id}>
              <div className="relative size-[164px]">
                <Link
                  aria-label={`${recipe.name} 레시피 상세 보기`}
                  className="focus-visible:ring-ring relative block size-full rounded-lg focus-visible:ring-2"
                  href={recipe.href}
                >
                  {recipe.imageSrc ? (
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="rounded-lg object-cover"
                      fill
                      sizes="164px"
                      src={recipe.imageSrc}
                      unoptimized={!recipe.imageSrc.startsWith('/')}
                    />
                  ) : (
                    <span
                      aria-label="레시피 이미지 준비 중"
                      className="bg-surface-disabled text-text-tertiary grid size-full place-items-center rounded-lg"
                      role="img"
                    >
                      <Image
                        alt=""
                        aria-hidden="true"
                        height={48}
                        src="/icons/navigation/recipe-line.svg"
                        width={48}
                      />
                    </span>
                  )}
                </Link>
              </div>
              <Link className="mt-2 block" href={recipe.href}>
                <span className="flex items-center gap-1">
                  <strong className="truncate text-[15px] leading-[23px] font-semibold">
                    {recipe.name}
                  </strong>
                  {recipe.rank === 3 ? (
                    <span className="bg-surface-disabled text-text-secondary shrink-0 rounded-full px-2 text-xs leading-[18px] font-medium">
                      {recipe.rank}위
                    </span>
                  ) : null}
                </span>
                <span className="block text-[13px] leading-5">{recipe.meta}</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
