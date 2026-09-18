/** Swagger 레시피 API 요청과 응답 타입 정의함 */

export interface RecipeDto {
  recipeId: number;
  title: string;
  description: string;
  cuisineType: 'KOREAN' | 'WESTERN' | 'JAPANESE' | 'CHINESE' | 'ETC';
  cookingTime: number;
  servings: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  thumbnailUrl: string | null;
}

export interface RecipeIngredientDto {
  ingredientId: number;
  name: string;
  requiredAmount: number;
  unit: string;
  isMain: boolean;
}

export interface RecipeStepDto {
  stepNumber: number;
  description: string;
  imageUrl: string | null;
}

export interface RecipeDetailDto extends RecipeDto {
  ingredients: RecipeIngredientDto[];
  steps: RecipeStepDto[];
}

export interface CookingHistoryDto {
  historyId: number;
  recipeId: number;
  cookedAt: string;
}
