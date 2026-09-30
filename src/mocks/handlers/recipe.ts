import { http, HttpResponse } from 'msw';

import type {
  RecipeRecommendationItemDto,
  RecipeRecommendationsDto,
} from '@/entities/recipe/api/recipe.dto';
import type { ApiSuccessResponse } from '@/shared/api/api-response';

const recommendationItems: RecipeRecommendationItemDto[] = [
  {
    rank: 1,
    reason: '선호하는 한식과 잘 맞아요.',
    coverage: null,
    missingCount: null,
    missingIngredients: [],
    recipe: {
      recipeId: 101,
      title: '반숙 계란장',
      description: '부드러운 반숙 계란에 간장 양념을 더한 밑반찬이에요.',
      cuisineType: 'KOREAN',
      cookingTime: 25,
      servings: 2,
      difficulty: 'EASY',
      thumbnailUrl: '/images/home/recipe-egg.png',
    },
  },
  {
    rank: 2,
    reason: '즐겨 찾는 한식 메뉴와 비슷해요.',
    coverage: null,
    missingCount: null,
    missingIngredients: [],
    recipe: {
      recipeId: 102,
      title: '소불고기',
      description: '달콤한 양념에 재운 소고기를 부드럽게 볶은 메뉴예요.',
      cuisineType: 'KOREAN',
      cookingTime: 30,
      servings: 2,
      difficulty: 'NORMAL',
      thumbnailUrl: '/images/home/recipe-bulgogi.png',
    },
  },
  {
    rank: 3,
    reason: '최근 선택한 담백한 메뉴 취향을 반영했어요.',
    coverage: null,
    missingCount: null,
    missingIngredients: [],
    recipe: {
      recipeId: 103,
      title: '두부조림',
      description: '담백한 두부에 매콤한 양념을 졸여 만든 반찬이에요.',
      cuisineType: 'KOREAN',
      cookingTime: 20,
      servings: 2,
      difficulty: 'EASY',
      thumbnailUrl: '/images/home/recipe-tofu.png',
    },
  },
];

function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    status: 'SUCCESS',
    message: '개인화 레시피 추천을 조회했습니다.',
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

export const recipeHandlers = [
  http.get('*/api/recipes/recommendations', ({ request }) => {
    const url = new URL(request.url);
    const requestedSize = Number(url.searchParams.get('size') ?? 20);
    const maxMinutes = Number(url.searchParams.get('maxMinutes') ?? Number.POSITIVE_INFINITY);
    const items = recommendationItems
      .filter((item) => item.recipe.cookingTime <= maxMinutes)
      .slice(0, requestedSize)
      .map((item, index) => ({ ...item, rank: index + 1 }));
    const response: RecipeRecommendationsDto = {
      requestId: 'mock-home-recommendation',
      source: 'AI',
      items,
    };

    return HttpResponse.json(successResponse(response));
  }),
];
