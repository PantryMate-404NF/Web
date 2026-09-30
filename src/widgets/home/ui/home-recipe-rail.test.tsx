import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import type { HomeRecipeCardItem } from '../model/home-recipe';
import { HomeRecipeRail } from './home-recipe-rail';

const recipes: HomeRecipeCardItem[] = [
  {
    id: '42',
    name: '토마토 달걀 볶음',
    imageSrc: 'https://cdn.example.test/tomato-egg.jpg',
    meta: '중식 · 25분',
    rank: 1,
    href: '/recipe/42?requestId=rec-request-1&position=1',
  },
  {
    id: '7',
    name: '계란 볶음밥',
    imageSrc: null,
    meta: '한식 · 15분',
    rank: 2,
    href: '/recipe/7?requestId=rec-request-1&position=2',
  },
];

describe('HomeRecipeRail', () => {
  it('renders API recommendations and preserves recommendation context links', () => {
    const markup = renderToStaticMarkup(createElement(HomeRecipeRail, { recipes }));

    expect(markup).toContain('맛 선호도를 반영해 AI가 추천했어요.');
    expect(markup).toContain('토마토 달걀 볶음');
    expect(markup).toContain('중식 · 25분');
    expect(markup).toContain('/recipe/42?requestId=rec-request-1&amp;position=1');
    expect(markup).toContain('레시피 이미지 준비 중');
  });

  it('announces loading and empty recommendation states', () => {
    const loadingMarkup = renderToStaticMarkup(createElement(HomeRecipeRail, { isPending: true }));
    const emptyMarkup = renderToStaticMarkup(createElement(HomeRecipeRail, { recipes: [] }));

    expect(loadingMarkup).toContain('추천 레시피를 불러오는 중이에요.');
    expect(loadingMarkup).toContain('role="status"');
    expect(emptyMarkup).toContain('추천할 레시피를 준비 중이에요.');
  });

  it('shows a safe message for unavailable recommendations and exposes retry', () => {
    const markup = renderToStaticMarkup(
      createElement(HomeRecipeRail, {
        error: new ApiError(503, 'RECIPE-UNAVAILABLE-RECOMMEND', '추천 불가'),
        onRetry: vi.fn(),
      }),
    );

    expect(markup).toContain('알레르기 정보를 확인할 수 없어 추천을 잠시 중단했어요.');
    expect(markup).toContain('다시 시도');
    expect(markup).toContain('role="alert"');
  });

  it('shows a general retry state for other errors', () => {
    const markup = renderToStaticMarkup(
      createElement(HomeRecipeRail, { error: new Error('network'), onRetry: vi.fn() }),
    );

    expect(markup).toContain('추천 레시피를 불러오지 못했어요.');
    expect(markup).toContain('다시 시도');
  });
});
