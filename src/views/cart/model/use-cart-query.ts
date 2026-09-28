import { useQuery } from '@tanstack/react-query';

import { getCart } from '@/entities/cart/api/get-cart';
import { toCartItem } from '@/entities/cart/api/cart.mapper';
import { CART_QUERY_KEY } from '@/entities/cart/model/query-key';

export { CART_QUERY_KEY };

export function useCartQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getCart,
    queryKey: CART_QUERY_KEY,
    select: (cart) => ({ cartId: cart.cartId, items: cart.items.map(toCartItem) }),
  });
}
