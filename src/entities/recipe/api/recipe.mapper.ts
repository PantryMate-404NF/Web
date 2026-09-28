/** Swagger 레시피 목록 응답을 기존 카드 모델로 변환함 */

import type { Recipe, RecipeDetail } from '../model/types';
import type { RecipeDetailDto, RecipeDto, RecipeListResponseDto } from './recipe.dto';

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
    thumbnailUrl: dto.thumbnailUrl,
    cookingSteps: [],
    missingCount: 0,
    ingredients: [],
    linkedProducts: [],
  };
}

export function toRecipePage(dto: RecipeListResponseDto) {
  return {
    content: dto.content.map(toRecipe),
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
  };
}

export function toRecipeDetail(dto: RecipeDetailDto): RecipeDetail {
  const steps = [...dto.steps]
    .sort((left, right) => left.stepNumber - right.stepNumber)
    .map((step) => ({
      number: step.stepNumber,
      description: step.description,
      imageUrl: step.imageUrl,
    }));

  return {
    ...toRecipe(dto),
    servings: dto.servings,
    difficulty: dto.difficulty,
    ingredients: dto.ingredients.map((ingredient) => ({
      id: String(ingredient.ingredientId),
      name: ingredient.name,
      imageUrl: ingredient.imageUrl ?? null,
      amount: `${ingredient.requiredAmount ?? ''}${ingredient.unit ?? ''}`,
      isMain: ingredient.isMain,
    })),
    cookingSteps: steps.map((step) => step.description),
    steps,
  };
}
