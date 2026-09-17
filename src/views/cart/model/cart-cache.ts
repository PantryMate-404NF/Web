import type { CartItemMutationResponseDto, CartResponseDto } from '@/entities/cart/api/cart.dto';

export function updateCartItemInCache(
  cart: CartResponseDto | undefined,
  updatedItem: CartItemMutationResponseDto,
) {
  if (!cart) return cart;

  return {
    ...cart,
    items: cart.items.map((item) =>
      item.cartItemId === updatedItem.cartItemId
        ? { ...item, quantity: updatedItem.quantity }
        : item,
    ),
  };
}

export function removeCartItemsFromCache(
  cart: CartResponseDto | undefined,
  removedItemIds: number[],
) {
  if (!cart) return cart;

  const removedIds = new Set(removedItemIds);
  return { ...cart, items: cart.items.filter((item) => !removedIds.has(item.cartItemId)) };
}
