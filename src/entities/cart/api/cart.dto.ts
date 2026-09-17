export type CartItemStatus = 'ON_SALE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface CartItemDto {
  cartItemId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
  status: CartItemStatus;
  purchasable: boolean;
}

export interface CartResponseDto {
  cartId: number;
  items: CartItemDto[];
}

export interface CartItemMutationResponseDto {
  cartItemId: number;
  productId: number;
  quantity: number;
}
