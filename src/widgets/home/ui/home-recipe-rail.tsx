import Image from 'next/image';
import Link from 'next/link';

import { HOME_RECIPES } from '../model/home-content';
import { HomeSectionHeading } from './home-section-heading';

export function HomeRecipeRail() {
  return (
    <section className="pt-2.5 pb-4 pl-4 [background:var(--home-recipe-background)]">
      <HomeSectionHeading
        description="내 취향과 식생활에 맞는 레시피를 만나보세요."
        href="/recipe"
        title="나를 위한 레시피"
      />
      <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto">
        {HOME_RECIPES.map((recipe, index) => (
          <article className="w-[164px] shrink-0" key={recipe.id}>
            <div className="relative size-[164px]">
              <Link
                aria-label={`${recipe.name} 레시피 상세 보기`}
                className="focus-visible:ring-ring relative block size-full rounded-lg focus-visible:ring-2"
                href={`/recipe/${recipe.id}`}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="rounded-lg object-cover"
                  fill
                  sizes="164px"
                  src={recipe.imageSrc}
                />
              </Link>
              <span
                aria-hidden="true"
                className="bg-background/80 absolute top-2 right-2 grid size-8 place-items-center rounded-full"
              >
                <Image alt="" aria-hidden="true" height={16} src={recipe.saveIconSrc} width={16} />
              </span>
            </div>
            <Link className="mt-2 block" href={`/recipe/${recipe.id}`}>
              <span className="flex items-center gap-1">
                <strong className="truncate text-[15px] leading-[23px] font-semibold">
                  {recipe.name}
                </strong>
                {index === 2 ? (
                  <span className="bg-surface-disabled text-text-secondary shrink-0 rounded-full px-2 text-xs leading-[18px] font-medium">
                    3위
                  </span>
                ) : null}
              </span>
              <span className="block text-[13px] leading-5">{recipe.meta}</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
