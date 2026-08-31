import type { CartProduct } from '@/entities/cart/model/cart-store';

export type LinkedRecipeProduct = CartProduct & {
  isShortage: boolean;
};

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
