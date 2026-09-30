'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addCartItem } from '@/entities/cart/api/add-cart-item';
import { getCart } from '@/entities/cart/api/get-cart';
import { CART_QUERY_KEY } from '@/entities/cart/model/query-key';

export function useAddProductToCart() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    addProduct: mutation.mutateAsync,
    error: mutation.error,
    isPending: mutation.isPending,
    loadCart: async () => {
      const cart = await getCart();
      queryClient.setQueryData(CART_QUERY_KEY, cart);
      return cart;
    },
    reset: mutation.reset,
  };
}
