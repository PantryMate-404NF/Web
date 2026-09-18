import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const pageSource = readFileSync(resolve(__dirname, 'scrapped-recipes-page.tsx'), 'utf8');

describe('ScrappedRecipesPage', () => {
  it('레시피 목록 Query 결과에서 스크랩한 레시피를 찾는다', () => {
    expect(pageSource).toContain(
      "import { useRecipesQuery } from '@/entities/recipe/api/use-recipes-query';",
    );
    expect(pageSource).toContain('const { data: apiRecipes } = useRecipesQuery();');
    expect(pageSource).toContain(
      'selectScrappedRecipes(scrappedRecipeIds, apiRecipes ?? recipeMocks)',
    );
  });

  it('목업 단계에서는 목록과 동일한 로컬 레시피 이미지를 사용한다', () => {
    expect(pageSource).toContain('src="/images/delivery/antibiotic-free-eggs.png"');
    expect(pageSource).toContain(
      'className="bg-card/80 absolute top-2 right-2.5 grid size-8 place-items-center rounded-full"',
    );
    expect(pageSource).toContain('fill="var(--primitive-primary-700)"');
    expect(pageSource).toContain('text-[15px] leading-[1.5] font-semibold');
    expect(pageSource).toContain('text-[13px] leading-[1.5] font-normal');
  });
});
