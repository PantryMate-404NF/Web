import type { CartProduct } from '@/entities/cart/model/cart-store';
import type { RecipeIngredient } from '@/entities/recipe/model/types';

export interface RecipeCartRequest {
  productId: number;
  quantity: number;
}

export function getLocalRecipeCartProducts(
  ingredients: RecipeIngredient[],
  selectedIngredientIds: string[],
  mode: 'all' | 'selected',
): CartProduct[] {
  const selectedIds = new Set(selectedIngredientIds);

  return ingredients.flatMap<CartProduct>((ingredient) => {
    if (mode === 'selected' && !selectedIds.has(ingredient.id)) return [];
    if (mode === 'all' && ingredient.isOwned === true) return [];

    const mappedProduct = ingredient.mappedProduct;
    if (
      !mappedProduct ||
      !Number.isSafeInteger(mappedProduct.productId) ||
      mappedProduct.productId <= 0 ||
      !Number.isSafeInteger(mappedProduct.quantity) ||
      mappedProduct.quantity <= 0
    ) {
      return [
        {
          id: `recipe-ingredient:${ingredient.id}`,
          ingredient: ingredient.name,
          name: `${ingredient.name} (상품 연결 전)`,
          price: 0,
          purchasable: false,
        },
      ];
    }

    return Array.from({ length: mappedProduct.quantity }, () => ({
      id: String(mappedProduct.productId),
      productId: mappedProduct.productId,
      ingredient: ingredient.name,
      name: mappedProduct.productName,
      price: mappedProduct.price,
      purchasable: true,
      thumbnailUrl: mappedProduct.productImageUrl ?? undefined,
    }));
  });
}

export function getRecipeCartRequests(
  ingredients: RecipeIngredient[],
  selectedIngredientIds: string[],
  mode: 'all' | 'selected',
): RecipeCartRequest[] {
  const selectedIds = new Set(selectedIngredientIds);
  const quantities = new Map<number, number>();

  for (const ingredient of ingredients) {
    if (mode === 'selected' && !selectedIds.has(ingredient.id)) continue;
    if (mode === 'all' && ingredient.isOwned === true) continue;

    const mappedProduct = ingredient.mappedProduct;
    if (!mappedProduct) continue;
    if (
      !Number.isSafeInteger(mappedProduct.productId) ||
      mappedProduct.productId <= 0 ||
      !Number.isSafeInteger(mappedProduct.quantity) ||
      mappedProduct.quantity <= 0
    ) {
      continue;
    }

    quantities.set(
      mappedProduct.productId,
      (quantities.get(mappedProduct.productId) ?? 0) + mappedProduct.quantity,
    );
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}
