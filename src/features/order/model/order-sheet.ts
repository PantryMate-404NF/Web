import { getCartTotal } from '@/entities/cart/model/cart-store';
import type { CartItem } from '@/entities/cart/model/cart-store';

export const ORDER_AGREEMENT_IDS = ['service', 'personal-info', 'third-party'] as const;

export type OrderAgreementId = (typeof ORDER_AGREEMENT_IDS)[number];

const SHIPPING_FEE = 3000;

export function buildOrderHref(cartId: number, itemIds: string[]) {
  const searchParams = new URLSearchParams({ cartId: String(cartId), items: itemIds.join(',') });

  return `/order?${searchParams.toString()}`;
}

export function buildPaymentExecutionInput(
  cartId: number | undefined,
  selectedCartItemIds: number[],
  idempotencyKey: string,
) {
  if (cartId === undefined) throw new Error('장바구니 API 정보가 필요합니다.');
  if (selectedCartItemIds.length === 0) throw new Error('주문할 장바구니 상품이 필요합니다.');

  return { cartId, idempotencyKey, selectedCartItemIds };
}

export function selectOrderItems(items: CartItem[], selectedItemIds: string[]) {
  if (selectedItemIds.length === 0) return items;

  const selectedIds = new Set(selectedItemIds);
  return items.filter((item) => selectedIds.has(item.id));
}

export function calculateOrderAmounts(items: CartItem[]) {
  const orderAmount = getCartTotal(items);
  const shippingFee = orderAmount > 0 ? SHIPPING_FEE : 0;

  return {
    finalAmount: orderAmount + shippingFee,
    orderAmount,
    shippingFee,
  };
}

export function toggleOrderAgreement(selectedIds: string[], agreementId: string) {
  return selectedIds.includes(agreementId)
    ? selectedIds.filter((id) => id !== agreementId)
    : [...selectedIds, agreementId];
}

export function areAllRequiredAgreementsSelected(selectedIds: string[]) {
  return ORDER_AGREEMENT_IDS.every((agreementId) => selectedIds.includes(agreementId));
}
