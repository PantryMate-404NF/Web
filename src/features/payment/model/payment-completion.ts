import type { DeliveryAddress } from '@/entities/address/model/address';
import type { CartItem } from '@/entities/cart/model/cart-store';
import type { OrderCreateResponseDto } from '@/entities/order/api/order.dto';
import type { UserProfile } from '@/entities/user/api/user.dto';

export interface PaymentCompletionSnapshot {
  selectedCartItemIds?: number[];
  deliveryAddress: Pick<
    DeliveryAddress,
    'addressLine1' | 'addressLine2' | 'phoneNumber' | 'postalCode' | 'recipientName'
  >;
  deliveryRequest: { location: string; detail: string };
  items: Array<
    Pick<CartItem, 'id' | 'name' | 'price' | 'productId' | 'quantity'> & { imageUrl?: string }
  >;
  orderNumber: string;
  orderedAt: string;
  orderer: { name: string; phoneNumber: string | null };
  paymentAmount: number;
}

export interface PaymentCompletionDetails {
  deliveryAddress: DeliveryAddress;
  deliveryRequest: { location: string; detail: string };
  items: CartItem[];
  orderer?: Pick<UserProfile, 'nickname' | 'phoneNumber'>;
}

export function buildPaymentCompletionSnapshot({
  deliveryAddress,
  deliveryRequest,
  items,
  order,
  orderer,
  selectedCartItemIds,
}: PaymentCompletionDetails & {
  order: Pick<OrderCreateResponseDto, 'createdAt' | 'orderId' | 'totalAmount'>;
  selectedCartItemIds: number[];
}): PaymentCompletionSnapshot {
  return {
    selectedCartItemIds,
    deliveryAddress: {
      addressLine1: deliveryAddress.addressLine1,
      addressLine2: deliveryAddress.addressLine2,
      phoneNumber: deliveryAddress.phoneNumber,
      postalCode: deliveryAddress.postalCode,
      recipientName: deliveryAddress.recipientName,
    },
    deliveryRequest,
    items: items.map((item) => ({
      id: item.id,
      imageUrl: item.thumbnailUrl,
      name: item.name,
      price: item.price,
      ...(item.productId ? { productId: item.productId } : {}),
      quantity: item.quantity,
    })),
    orderNumber: order.orderId,
    orderedAt: order.createdAt,
    orderer: {
      name: orderer?.nickname ?? '',
      phoneNumber: orderer?.phoneNumber ?? null,
    },
    paymentAmount: order.totalAmount,
  };
}

export function getPaymentCompletionCartItemIds(
  snapshot: Pick<PaymentCompletionSnapshot, 'items' | 'selectedCartItemIds'> | undefined,
) {
  if (!snapshot) return [];

  const cartItemIds = snapshot.selectedCartItemIds?.length
    ? snapshot.selectedCartItemIds
    : snapshot.items.map((item) => Number(item.id));

  return [...new Set(cartItemIds)].filter(
    (cartItemId) => Number.isSafeInteger(cartItemId) && cartItemId > 0,
  );
}

export function isPaymentCompletionSnapshot(value: unknown): value is PaymentCompletionSnapshot {
  if (!value || typeof value !== 'object') return false;

  const snapshot = value as Partial<PaymentCompletionSnapshot>;
  const address = snapshot.deliveryAddress;

  return (
    typeof snapshot.orderNumber === 'string' &&
    typeof snapshot.orderedAt === 'string' &&
    (snapshot.selectedCartItemIds === undefined ||
      (Array.isArray(snapshot.selectedCartItemIds) &&
        snapshot.selectedCartItemIds.every(
          (itemId) => Number.isSafeInteger(itemId) && itemId > 0,
        ))) &&
    Number.isSafeInteger(snapshot.paymentAmount) &&
    !!snapshot.orderer &&
    typeof snapshot.orderer.name === 'string' &&
    (typeof snapshot.orderer.phoneNumber === 'string' || snapshot.orderer.phoneNumber === null) &&
    !!address &&
    typeof address.addressLine1 === 'string' &&
    typeof address.addressLine2 === 'string' &&
    typeof address.phoneNumber === 'string' &&
    typeof address.postalCode === 'string' &&
    typeof address.recipientName === 'string' &&
    !!snapshot.deliveryRequest &&
    typeof snapshot.deliveryRequest.location === 'string' &&
    typeof snapshot.deliveryRequest.detail === 'string' &&
    Array.isArray(snapshot.items) &&
    snapshot.items.every(
      (item) =>
        !!item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        Number.isSafeInteger(item.price) &&
        Number.isSafeInteger(item.quantity) &&
        (item.productId === undefined ||
          (Number.isSafeInteger(item.productId) && item.productId > 0)) &&
        (item.imageUrl === undefined || typeof item.imageUrl === 'string'),
    )
  );
}
