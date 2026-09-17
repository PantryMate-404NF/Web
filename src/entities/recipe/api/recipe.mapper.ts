/** Swagger 레시피 목록 응답을 기존 카드 모델로 변환함 */

import type { Recipe } from '../model/types';
import type { RecipeDto } from './recipe.dto';

const cuisineLabels = {
  KOREAN: '한식',
  WESTERN: '양식',
  JAPANESE: '일식',
  CHINESE: '중식',
  ETC: '기타',
} as const;

export function toRecipe(dto: RecipeDto): Recipe {
  return {
    id: String(dto.recipeId),
    name: dto.title,
    category: cuisineLabels[dto.cuisineType],
    cookTime: `${dto.cookingTime}분`,
    description: dto.description,
    cookingSteps: [],
    missingCount: 0,
    ingredients: [],
    linkedProducts: [],
  };
}
