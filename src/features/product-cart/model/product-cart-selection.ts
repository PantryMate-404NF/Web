import type { CartProduct } from '@/entities/cart/model/cart-store';
import type { ProductDetail, ProductOption } from '@/entities/product/model/types';

export type ProductOptionQuantities = Record<string, number>;

export function createInitialOptionQuantities(options: ProductOption[]): ProductOptionQuantities {
  return Object.fromEntries(options.map((option, index) => [option.id, index === 0 ? 1 : 0]));
}

export function updateOptionQuantity(
  quantities: ProductOptionQuantities,
  optionId: string,
  amount: number,
): ProductOptionQuantities {
  return {
    ...quantities,
    [optionId]: Math.max(0, (quantities[optionId] ?? 0) + amount),
  };
}

export function selectCartProducts(
  product: ProductDetail,
  quantities: ProductOptionQuantities,
): CartProduct[] {
  const options = product.options ?? [
    { id: 'default', label: product.weight, price: product.price } satisfies ProductOption,
  ];

  return options.flatMap((option) =>
    Array.from({ length: quantities[option.id] ?? 0 }, () => ({
      id: `${product.id}:${option.id}`,
      ingredient: option.label,
      name: product.name,
      price: option.price,
      thumbnailUrl: product.thumbnailUrl ?? product.imageUrl,
    })),
  );
}
