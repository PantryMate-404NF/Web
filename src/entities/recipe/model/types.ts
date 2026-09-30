export type RecipeTab = 'main' | 'imminent';

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  imageUrl?: string | null;
  isOwned?: boolean;
  isImminent?: boolean;
  isMain?: boolean;
}

export interface RecipeStep {
  number: number;
  description: string;
  imageUrl: string | null;
}

export interface RecipeLinkedProduct {
  id: string;
  ingredient: string;
  name: string;
  price: number;
  isShortage: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  cookTime: string;
  description: string;
  thumbnailUrl?: string | null;
  cookingSteps: string[];
  missingCount: number;
  ingredients: RecipeIngredient[];
  linkedProducts: RecipeLinkedProduct[];
}

export interface RecipeDetail extends Recipe {
  servings: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  steps: RecipeStep[];
}
