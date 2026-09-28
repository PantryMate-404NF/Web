import { http, HttpResponse } from 'msw';

import type {
  AddCartItemRequestDto,
  CartItemDto,
  CartItemMutationResponseDto,
  CartResponseDto,
} from '@/entities/cart/api/cart.dto';
import { productMocks } from '@/entities/product/model/mock';
import type { ApiSuccessResponse } from '@/shared/api/api-response';

let nextCartItemId = 1;
let cartItems: CartItemDto[] = [];

function successResponse<T>(data: T, message: string): ApiSuccessResponse<T> {
  return {
    status: 'SUCCESS',
    message,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

export function resetCartMock() {
  nextCartItemId = 1;
  cartItems = [];
}

export const cartHandlers = [
  http.get('*/api/carts', () => {
    const cart: CartResponseDto = { cartId: 1, items: cartItems };
    return HttpResponse.json(successResponse(cart, '장바구니를 조회했습니다.'));
  }),
  http.post('*/api/carts/items', async ({ request }) => {
    const input = (await request.json()) as AddCartItemRequestDto;
    const product = productMocks.find((item) => item.mockCommerceProductId === input.productId);

    if (!product || !Number.isSafeInteger(input.quantity) || input.quantity < 1) {
      return HttpResponse.json(
        {
          status: 'ERROR',
          message: '상품 정보 또는 수량이 올바르지 않습니다.',
          data: null,
          error: 'CART-INVALID-ITEM',
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    const existingItem = cartItems.find((item) => item.productId === input.productId);

    if (existingItem) {
      existingItem.quantity += input.quantity;
      const response: CartItemMutationResponseDto = {
        cartItemId: existingItem.cartItemId,
        productId: existingItem.productId,
        quantity: existingItem.quantity,
      };
      return HttpResponse.json(successResponse(response, '장바구니 수량을 변경했습니다.'));
    }

    const cartItem: CartItemDto = {
      cartItemId: nextCartItemId++,
      productId: input.productId,
      productName: product.name,
      thumbnailUrl: product.thumbnailUrl ?? product.imageUrl ?? '',
      price: product.price,
      quantity: input.quantity,
      status: 'ON_SALE',
      purchasable: product.isAvailable,
    };
    cartItems.push(cartItem);

    const response: CartItemMutationResponseDto = {
      cartItemId: cartItem.cartItemId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    };
    return HttpResponse.json(successResponse(response, '장바구니에 상품을 담았습니다.'), {
      status: 201,
    });
  }),
];
