import { useQuery } from '@tanstack/react-query';

import { getCart } from '@/entities/cart/api/get-cart';
import { toCartItem } from '@/entities/cart/api/cart.mapper';

export const CART_QUERY_KEY = ['cart', 'detail'] as const;

export function useCartQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getCart,
    queryKey: CART_QUERY_KEY,
    select: (cart) => ({ cartId: cart.cartId, items: cart.items.map(toCartItem) }),
  });
}
