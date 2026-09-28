import type { CartProduct } from '@/entities/cart/model/cart-store';
import type { ProductDetail, ProductOption } from '@/entities/product/model/types';

export type ProductOptionQuantities = Record<string, number>;
export type CartRequestMode = 'api' | 'mock-api';

export interface SelectedCartRequest {
  optionId: string;
  productId: number;
  quantity: number;
}

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

export function getSelectedCartRequests(
  product: ProductDetail,
  quantities: ProductOptionQuantities,
  mode: CartRequestMode,
): SelectedCartRequest[] | undefined {
  const options = product.options ?? [
    {
      id: 'default',
      label: product.weight,
      price: product.price,
      commerceProductId: product.commerceProductId,
      mockCommerceProductId: product.mockCommerceProductId,
    } satisfies ProductOption,
  ];
  const selectedOptions = options.filter((option) => (quantities[option.id] ?? 0) > 0);
  const requests = selectedOptions.map((option) => ({
    optionId: option.id,
    productId: mode === 'mock-api' ? option.mockCommerceProductId : option.commerceProductId,
    quantity: quantities[option.id] ?? 0,
  }));

  if (requests.some((request) => request.productId === undefined)) return undefined;

  return requests.map((request) => ({ ...request, productId: request.productId as number }));
}

export function hasAnyCartProductIdentifier(
  product: ProductDetail,
  mode: CartRequestMode,
): boolean {
  const options = product.options;

  if (!options) {
    return Boolean(mode === 'mock-api' ? product.mockCommerceProductId : product.commerceProductId);
  }

  return options.some((option) =>
    Boolean(mode === 'mock-api' ? option.mockCommerceProductId : option.commerceProductId),
  );
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
