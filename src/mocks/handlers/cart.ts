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
const cartItemsByUser = new Map<string, CartItemDto[]>();

function getUserKey(request: Request) {
  return request.headers.get('Authorization') ?? request.headers.get('X-User-Id') ?? 'anonymous';
}

function getCartItems(request: Request) {
  const userKey = getUserKey(request);
  const items = cartItemsByUser.get(userKey) ?? [];
  cartItemsByUser.set(userKey, items);
  return items;
}

function getMockCartProduct(productId: number) {
  for (const product of productMocks) {
    if (product.mockCommerceProductId === productId) {
      return {
        isAvailable: product.isAvailable,
        name: product.name,
        price: product.price,
        product,
      };
    }

    const option = product.options?.find((item) => item.mockCommerceProductId === productId);
    if (option) {
      return {
        isAvailable: product.isAvailable,
        name: `${product.name} ${option.label}`,
        price: option.price,
        product,
      };
    }
  }

  return undefined;
}

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
  cartItemsByUser.clear();
}

export const cartHandlers = [
  http.get('*/api/cart', ({ request }) => {
    const cartItems = getCartItems(request);
    const cart: CartResponseDto = { cartId: 1, items: cartItems };
    return HttpResponse.json(successResponse(cart, '장바구니를 조회했습니다.'));
  }),
  http.post('*/api/cart/items', async ({ request }) => {
    const input = (await request.json()) as AddCartItemRequestDto;
    const mockProduct = getMockCartProduct(input.productId);

    if (!mockProduct || !Number.isSafeInteger(input.quantity) || input.quantity < 1) {
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

    if (!mockProduct.isAvailable) {
      return HttpResponse.json(
        {
          status: 'ERROR',
          message: '현재 판매할 수 없는 상품입니다.',
          data: null,
          error: 'CART-PRODUCT-NOT-AVAILABLE',
          timestamp: new Date().toISOString(),
        },
        { status: 409 },
      );
    }

    const cartItems = getCartItems(request);
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
      productName: mockProduct.name,
      thumbnailUrl: mockProduct.product.thumbnailUrl ?? mockProduct.product.imageUrl ?? '',
      price: mockProduct.price,
      quantity: input.quantity,
      status: 'ON_SALE',
      purchasable: true,
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
