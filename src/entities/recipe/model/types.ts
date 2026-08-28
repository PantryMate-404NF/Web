export type RecipeTab = 'main' | 'imminent';

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  isOwned: boolean;
  isImminent?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  cookTime: string;
  description: string;
  missingCount: number;
  ingredients: RecipeIngredient[];
}
