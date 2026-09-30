import { describe, expect, it } from 'vitest';

import type { RecipeRecommendationsDto } from '@/entities/recipe/api/recipe.dto';

import { toHomeRecipeCards } from './home-recipe';

describe('toHomeRecipeCards', () => {
  it('keeps recommendation order and includes AI context in detail links', () => {
    const recommendations: RecipeRecommendationsDto = {
      requestId: 'rec-request-1',
      source: 'AI',
      items: [
        {
          rank: 1,
          reason: '선호하는 한식과 잘 맞아요.',
          coverage: null,
          missingCount: null,
          missingIngredients: [],
          recipe: {
            recipeId: 42,
            title: '토마토 달걀 볶음',
            description: '간단한 한 끼',
            cuisineType: 'CHINESE',
            cookingTime: 25,
            servings: 1,
            difficulty: 'EASY',
            thumbnailUrl: 'https://cdn.example.test/tomato-egg.jpg',
          },
        },
        {
          rank: 2,
          reason: null,
          coverage: null,
          missingCount: null,
          missingIngredients: [],
          recipe: {
            recipeId: 7,
            title: '계란 볶음밥',
            description: '빠르게 만드는 볶음밥',
            cuisineType: 'KOREAN',
            cookingTime: 15,
            servings: 1,
            difficulty: 'EASY',
            thumbnailUrl: null,
          },
        },
      ],
    };

    expect(toHomeRecipeCards(recommendations)).toEqual([
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
    ]);
  });

  it('omits recommendation context for popularity fallback results', () => {
    const recommendations: RecipeRecommendationsDto = {
      requestId: null,
      source: 'POPULARITY',
      items: [
        {
          rank: 1,
          reason: null,
          coverage: null,
          missingCount: null,
          missingIngredients: [],
          recipe: {
            recipeId: 3,
            title: '두부조림',
            description: '인기 레시피',
            cuisineType: 'KOREAN',
            cookingTime: 20,
            servings: 2,
            difficulty: 'NORMAL',
          },
        },
      ],
    };

    expect(toHomeRecipeCards(recommendations)[0]?.href).toBe('/recipe/3');
  });
});
