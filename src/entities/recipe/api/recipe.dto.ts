/** Swagger 레시피 API 요청과 응답 타입 정의함 */

export interface RecipeDto {
  recipeId: number;
  title: string;
  description: string;
  cuisineType: 'KOREAN' | 'WESTERN' | 'JAPANESE' | 'CHINESE' | 'ETC';
  cookingTime: number;
  servings: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  thumbnailUrl?: string | null;
}

export interface RecipeIngredientDto {
  ingredientId: number;
  name: string;
  imageUrl?: string | null;
  requiredAmount?: number | null;
  unit?: string | null;
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

export interface RecipeListResponseDto {
  content: RecipeDto[];
  totalElements: number;
  totalPages: number;
}

export interface RecipeFilterIngredientDto {
  ingredientId: number;
  name: string;
  expiryDate: string;
  expired: boolean;
  defaultSelected: boolean;
}

export interface RecipePantryMatchItemDto {
  pantryItemId: number;
  expiryDate: string;
  expiryStatus: 'NORMAL' | 'IMMINENT' | 'EXPIRED';
}

export interface RecipeIngredientPantryMatchDto {
  ingredientId: number;
  name: string;
  hasIngredient: boolean;
  matchedPantryItems: RecipePantryMatchItemDto[];
}

export interface RecipePantryMatchDto {
  recipeId: number;
  ingredients: RecipeIngredientPantryMatchDto[];
}

export interface CookingCompleteRequestDto {
  pantryItemIds?: number[];
  requestId?: string;
  position?: number;
}

export type RecipeRecommendationSource = 'AI' | 'POPULARITY';

export interface RecipeRecommendationItemDto {
  rank: number;
  reason: string | null;
  coverage: number | null;
  missingCount: number | null;
  missingIngredients: Array<{ ingredientId: number; name: string }>;
  recipe: RecipeDto;
}

export interface RecipeRecommendationsDto {
  requestId: string | null;
  source: RecipeRecommendationSource;
  items: RecipeRecommendationItemDto[];
}

export interface RecipeRecommendationParams {
  size?: number;
  maxMinutes?: number;
}

export interface RecipeRecommendationContext {
  requestId?: string | null;
  position?: number;
}

export interface RecipeListParams {
  page?: number;
  size?: number;
  ingredientIds?: number[];
}

export interface RecipeSearchParams {
  keyword: string;
  page?: number;
  size?: number;
}
