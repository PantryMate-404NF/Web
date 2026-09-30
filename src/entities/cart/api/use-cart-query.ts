import { useQuery } from '@tanstack/react-query';

import { CART_QUERY_KEY } from '@/entities/cart/model/query-key';

import { toCartItem } from './cart.mapper';
import { getCart } from './get-cart';

export { CART_QUERY_KEY };

export function useCartQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getCart,
    queryKey: CART_QUERY_KEY,
    select: (cart) => ({ cartId: cart.cartId, items: cart.items.map(toCartItem) }),
  });
}
