export interface DeliveryAddress {
  id: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  isDefault: boolean;
}

export type DeliveryAddressInput = Omit<DeliveryAddress, 'id'>;

export const deliveryAddressMocks: readonly DeliveryAddress[] = [
  {
    id: 'home',
    recipientName: '집밥사랑',
    phoneNumber: '010-1234-2222',
    addressLine1: '서울특별시 신선하구 맛있동 425',
    addressLine2: '행복빌라, 101호',
    postalCode: '13485',
    isDefault: true,
  },
];

export function addDeliveryAddress(
  addresses: readonly DeliveryAddress[],
  address: DeliveryAddress,
): DeliveryAddress[] {
  const currentAddresses = address.isDefault
    ? addresses.map((currentAddress) => ({ ...currentAddress, isDefault: false }))
    : [...addresses];

  return [...currentAddresses, address];
}

export function getSafeOrderReturnTo(returnTo?: string): string | undefined {
  if (returnTo === '/order' || returnTo?.startsWith('/order?')) return returnTo;
  return undefined;
}

function withReturnTo(pathname: string, returnTo?: string): string {
  const safeReturnTo = getSafeOrderReturnTo(returnTo);
  return safeReturnTo ? `${pathname}?returnTo=${encodeURIComponent(safeReturnTo)}` : pathname;
}

export function buildAddressListHref(returnTo?: string): string {
  return withReturnTo('/mypage/addresses', returnTo);
}

export function buildAddressFormHref(returnTo?: string): string {
  return withReturnTo('/mypage/addresses/new', returnTo);
}
