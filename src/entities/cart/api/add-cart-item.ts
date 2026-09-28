import type {
  AddCartItemRequestDto,
  CartItemMutationResponseDto,
} from '@/entities/cart/api/cart.dto';
import { orderPaymentRequest } from '@/shared/api/order-payment-client';

export function addCartItem(input: AddCartItemRequestDto) {
  return orderPaymentRequest<CartItemMutationResponseDto>('/cart/items', {
    body: input,
    method: 'POST',
  });
}
