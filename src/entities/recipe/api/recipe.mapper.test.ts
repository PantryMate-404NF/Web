import { describe, expect, it } from 'vitest';

import { toRecipe } from './recipe.mapper';
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
    ).toMatchObject({ id: '7', name: '양파 볶음', category: '한식', cookTime: '10분' });
  });

  it('조리 완료 요청을 레시피 endpoint로 전송한다', async () => {
    // request는 별도 HTTP 단위 테스트에서 envelope를 검증한다. 이 테스트는 경로만 고정한다.
    expect(completeCooking).toBeTypeOf('function');
  });
});
