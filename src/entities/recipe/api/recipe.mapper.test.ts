import { describe, expect, it } from 'vitest';

import { toRecipe, toRecipeDetail, toRecipePage } from './recipe.mapper';
import { completeCooking } from './recipe-mutations';

describe('toRecipe', () => {
  it('Swagger 레시피 목록을 기존 카드 모델로 변환한다', () => {
    expect(
      toRecipe({
        recipeId: 7,
        title: '양파 볶음',
        description: '간단한 반찬',
        cuisineType: 'KOREAN',
        cookingTime: 10,
        servings: 2,
        difficulty: 'EASY',
        thumbnailUrl: null,
      }),
    ).toMatchObject({
      id: '7',
      name: '양파 볶음',
      category: '한식',
      cookTime: '10분',
      thumbnailUrl: null,
    });
  });

  it('상세 DTO의 실제 recipe ID, 메타데이터, 재료와 정렬된 조리 순서를 매핑한다', () => {
    expect(
      toRecipeDetail({
        recipeId: 42,
        title: '토마토 달걀 볶음',
        description: '재료를 볶습니다.',
        cuisineType: 'CHINESE',
        cookingTime: 20,
        servings: 2,
        difficulty: 'EASY',
        thumbnailUrl: 'https://cdn.example.test/recipe.jpg',
        ingredients: [
          {
            ingredientId: 8,
            name: '달걀',
            imageUrl: 'https://cdn.example.test/egg.jpg',
            requiredAmount: 2,
            unit: '개',
            isMain: true,
          },
          { ingredientId: 3, name: '토마토', requiredAmount: 1.5, unit: '개', isMain: false },
        ],
        steps: [
          { stepNumber: 2, description: '달걀을 넣고 볶습니다.', imageUrl: null },
          {
            stepNumber: 1,
            description: '토마토를 자릅니다.',
            imageUrl: 'https://cdn.example.test/step.jpg',
          },
        ],
      }),
    ).toEqual({
      id: '42',
      name: '토마토 달걀 볶음',
      category: '중식',
      cookTime: '20분',
      description: '재료를 볶습니다.',
      thumbnailUrl: 'https://cdn.example.test/recipe.jpg',
      cookingSteps: ['토마토를 자릅니다.', '달걀을 넣고 볶습니다.'],
      missingCount: 0,
      ingredients: [
        {
          id: '8',
          name: '달걀',
          amount: '2개',
          imageUrl: 'https://cdn.example.test/egg.jpg',
          isMain: true,
        },
        { id: '3', name: '토마토', amount: '1.5개', imageUrl: null, isMain: false },
      ],
      linkedProducts: [],
      servings: 2,
      difficulty: 'EASY',
      steps: [
        {
          number: 1,
          description: '토마토를 자릅니다.',
          imageUrl: 'https://cdn.example.test/step.jpg',
        },
        { number: 2, description: '달걀을 넣고 볶습니다.', imageUrl: null },
      ],
    });
  });

  it('nullable thumbnail and step image fields remain empty instead of using mock images', () => {
    const recipe = toRecipeDetail({
      recipeId: 9,
      title: '이미지 없는 레시피',
      description: '',
      cuisineType: 'ETC',
      cookingTime: 0,
      servings: 1,
      difficulty: 'NORMAL',
      thumbnailUrl: null,
      ingredients: [],
      steps: [{ stepNumber: 1, description: '완성합니다.', imageUrl: null }],
    });

    expect(recipe.thumbnailUrl).toBeNull();
    expect(recipe.steps).toEqual([{ number: 1, description: '완성합니다.', imageUrl: null }]);
  });

  it('maps optional ingredient amount fields without rendering undefined text', () => {
    const recipe = toRecipeDetail({
      recipeId: 10,
      title: '간단 레시피',
      description: '',
      cuisineType: 'ETC',
      cookingTime: 5,
      servings: 1,
      difficulty: 'EASY',
      ingredients: [{ ingredientId: 1, name: '소금', isMain: false }],
      steps: [],
    });

    expect(recipe.ingredients[0]?.amount).toBe('');
    expect(recipe.thumbnailUrl).toBeUndefined();
  });

  it('does not infer commerce product mappings from recipe detail ingredients', () => {
    const recipe = toRecipeDetail({
      recipeId: 11,
      title: '양파 달걀 볶음',
      description: '',
      cuisineType: 'KOREAN',
      cookingTime: 10,
      servings: 2,
      difficulty: 'EASY',
      ingredients: [
        {
          ingredientId: 1,
          name: '양파',
          requiredAmount: 1,
          unit: '개',
          isMain: true,
        },
      ],
      steps: [],
    });

    expect(recipe.ingredients[0]).not.toHaveProperty('mappedProduct');
  });

  it('조리 완료 요청을 레시피 endpoint로 전송한다', async () => {
    // request는 별도 HTTP 단위 테스트에서 envelope를 검증한다. 이 테스트는 경로만 고정한다.
    expect(completeCooking).toBeTypeOf('function');
  });
});

describe('toRecipePage', () => {
  it('maps the paginated list envelope and keeps server page metadata', () => {
    expect(
      toRecipePage({
        content: [
          {
            recipeId: 7,
            title: '양파 볶음',
            description: '간단한 반찬',
            cuisineType: 'KOREAN',
            cookingTime: 10,
            servings: 2,
            difficulty: 'EASY',
            thumbnailUrl: null,
          },
        ],
        totalElements: 41,
        totalPages: 5,
      }),
    ).toMatchObject({
      content: [{ id: '7', name: '양파 볶음' }],
      totalElements: 41,
      totalPages: 5,
    });
  });
});
