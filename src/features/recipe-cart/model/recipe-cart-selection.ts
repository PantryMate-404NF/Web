import type { CartProduct } from '@/entities/cart/model/cart-store';
import type { RecipeIngredientProductMatchDto } from '@/entities/recipe/api/recipe.dto';

export interface RecipeCartRequest {
  productId: number;
  quantity: number;
}

export function getLocalRecipeCartProducts(
  ingredients: RecipeIngredientProductMatchDto[],
  selectedIngredientIds: string[],
  mode: 'all' | 'selected',
): CartProduct[] {
  const selectedIds = new Set(selectedIngredientIds);

  return ingredients.flatMap<CartProduct>((ingredient) => {
    if (ingredient.hasIngredient) return [];
    if (mode === 'selected' && !selectedIds.has(String(ingredient.ingredientId))) return [];

    const mappedProduct = ingredient.matchStatus === 'MATCHED' ? ingredient.product : null;
    if (
      !mappedProduct ||
      !Number.isSafeInteger(mappedProduct.productId) ||
      mappedProduct.productId <= 0
    ) {
      return [
        {
          id: `recipe-ingredient:${ingredient.ingredientId}`,
          ingredient: ingredient.name,
          name: `${ingredient.name} (상품 연결 전)`,
          price: 0,
          purchasable: false,
        },
      ];
    }

    return [
      {
        id: String(mappedProduct.productId),
        productId: mappedProduct.productId,
        ingredient: ingredient.name,
        name: mappedProduct.name,
        price: mappedProduct.price,
        purchasable: true,
        thumbnailUrl: mappedProduct.thumbnailUrl ?? undefined,
      },
    ];
  });
}

export function getRecipeCartRequests(
  ingredients: RecipeIngredientProductMatchDto[],
  selectedIngredientIds: string[],
  mode: 'all' | 'selected',
): RecipeCartRequest[] {
  const selectedIds = new Set(selectedIngredientIds);
  const quantities = new Map<number, number>();

  for (const ingredient of ingredients) {
    if (mode === 'selected' && !selectedIds.has(String(ingredient.ingredientId))) continue;
    if (ingredient.hasIngredient) continue;

    if (ingredient.matchStatus !== 'MATCHED') continue;
    const mappedProduct = ingredient.product;
    if (!mappedProduct) continue;
    if (!Number.isSafeInteger(mappedProduct.productId) || mappedProduct.productId <= 0) continue;

    quantities.set(mappedProduct.productId, (quantities.get(mappedProduct.productId) ?? 0) + 1);
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}
