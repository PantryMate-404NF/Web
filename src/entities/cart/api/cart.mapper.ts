import type { CartItem } from '@/entities/cart/model/cart-store';

import type { CartItemDto } from './cart.dto';

export function toCartItem(item: CartItemDto): CartItem {
  return {
    cartItemId: item.cartItemId,
    id: String(item.cartItemId),
    ingredient: '기본 옵션',
    name: item.productName,
    price: item.price,
    productId: item.productId,
    purchasable: item.purchasable,
    quantity: item.quantity,
    thumbnailUrl: item.thumbnailUrl,
  };
}
