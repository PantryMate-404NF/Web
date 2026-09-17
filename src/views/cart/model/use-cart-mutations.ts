import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CartResponseDto } from '@/entities/cart/api/cart.dto';
import { deleteCartItem } from '@/entities/cart/api/delete-cart-item';
import { updateCartItem } from '@/entities/cart/api/update-cart-item';
import type { CartItem } from '@/entities/cart/model/cart-store';

import { removeCartItemsFromCache, updateCartItemInCache } from './cart-cache';
import { CART_QUERY_KEY } from './use-cart-query';

function getCartItemId(item: CartItem) {
  const cartItemId = item.cartItemId ?? Number(item.id);

  if (!Number.isSafeInteger(cartItemId) || cartItemId <= 0) {
    throw new Error('장바구니 상품 ID가 올바르지 않습니다.');
  }

  return cartItemId;
}

export function useCartMutations() {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({ item, quantity }: { item: CartItem; quantity: number }) =>
      updateCartItem(getCartItemId(item), quantity),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<CartResponseDto>(CART_QUERY_KEY, (cart) =>
        updateCartItemInCache(cart, updatedItem),
      );
    },
  });
  const removeMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const itemIds = items.map(getCartItemId);
      const results = await Promise.allSettled(itemIds.map(deleteCartItem));
      const failedResult = results.find((result) => result.status === 'rejected');

      if (failedResult?.status === 'rejected') {
        throw failedResult.reason;
      }

      return itemIds;
    },
    onSuccess: (removedItemIds) => {
      queryClient.setQueryData<CartResponseDto>(CART_QUERY_KEY, (cart) =>
        removeCartItemsFromCache(cart, removedItemIds),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    error: updateMutation.error ?? removeMutation.error,
    isPending: updateMutation.isPending || removeMutation.isPending,
    removeItems: (items: CartItem[]) => removeMutation.mutate(items),
    updateQuantity: (item: CartItem, quantity: number) => updateMutation.mutate({ item, quantity }),
  };
}
