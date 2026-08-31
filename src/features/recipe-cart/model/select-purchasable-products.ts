import type { CartProduct } from '@/entities/cart/model/cart-store';
import type { RecipeLinkedProduct } from '@/entities/recipe/model/types';

export type LinkedRecipeProduct = RecipeLinkedProduct;

export function selectPurchasableProducts(products: LinkedRecipeProduct[]): CartProduct[] {
  return products
    .filter((product) => product.isShortage)
    .map((product) => ({
      id: product.id,
      ingredient: product.ingredient,
      name: product.name,
      price: product.price,
    }));
}
