import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useScrappedRecipesQueryMock, useRecipesQueryMock } = vi.hoisted(() => ({
  useScrappedRecipesQueryMock: vi.fn(),
  useRecipesQueryMock: vi.fn(),
}));

vi.mock('@/entities/recipe/api/use-scrapped-recipes-query', () => ({
  useScrappedRecipesQuery: useScrappedRecipesQueryMock,
}));

vi.mock('@/entities/recipe/api/use-recipes-query', () => ({
  useRecipesQuery: useRecipesQueryMock,
}));

vi.mock('@/shared/ui/back-button', () => ({
  BackButton: () => <button type="button">뒤로</button>,
}));

import { ScrappedRecipesPage } from './scrapped-recipes-page';

const serverRecipe = {
  id: '42',
  name: '서버 스크랩 레시피',
  category: '한식',
  cookTime: '25분',
  description: '',
  thumbnailUrl: 'https://cdn.example.test/scrapped.jpg',
  cookingSteps: [],
  missingCount: 0,
  ingredients: [],
  linkedProducts: [],
};

describe('ScrappedRecipesPage', () => {
  beforeEach(() => {
    useScrappedRecipesQueryMock.mockReturnValue({
      data: [serverRecipe],
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useRecipesQueryMock.mockReturnValue({ data: [], error: null });
  });

  it('스크랩 API 결과를 실제 이미지와 상세 링크로 렌더링한다', () => {
    const markup = renderToStaticMarkup(<ScrappedRecipesPage />);

    expect(markup).toContain('서버 스크랩 레시피');
    expect(markup).toContain('href="/recipe/42"');
    expect(markup).toContain('https://cdn.example.test/scrapped.jpg');
  });

  it('스크랩 목록 조회 중에는 목업 레시피를 렌더링하지 않는다', () => {
    useScrappedRecipesQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    });
    const markup = renderToStaticMarkup(<ScrappedRecipesPage />);

    expect(markup).toContain('role="status"');
    expect(markup).not.toContain('서버 스크랩 레시피');
    expect(markup).not.toContain('토마토 달걀 볶음');
  });

  it('빈 서버 목록은 빈 상태로 표시한다', () => {
    useScrappedRecipesQueryMock.mockReturnValue({
      data: [],
      error: null,
      isPending: false,
    });
    const markup = renderToStaticMarkup(<ScrappedRecipesPage />);

    expect(markup).toContain('스크랩한 레시피가 없어요');
  });

  it('조회 오류를 목업 콘텐츠 대신 공통 오류 상태로 표시한다', () => {
    useScrappedRecipesQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('unauthorized'),
      isPending: false,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<ScrappedRecipesPage />);

    expect(markup).toContain('스크랩 레시피를 불러오지 못했어요');
    expect(markup).not.toContain('서버 스크랩 레시피');
  });
});
