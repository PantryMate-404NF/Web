export type RecipeTab = 'main' | 'imminent';

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  isOwned: boolean;
  isImminent?: boolean;
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
  cookingSteps: string[];
  missingCount: number;
  ingredients: RecipeIngredient[];
  linkedProducts: RecipeLinkedProduct[];
}
