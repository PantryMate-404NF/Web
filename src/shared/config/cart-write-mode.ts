export type CartWriteMode = 'api' | 'disabled' | 'mock-api' | 'preview';

export function getCartWriteMode({
  apiEnabled,
  apiMockingEnabled,
  isDevelopment,
}: {
  apiEnabled: boolean;
  apiMockingEnabled: boolean;
  isDevelopment: boolean;
}): CartWriteMode {
  if (apiEnabled) return 'api';
  if (isDevelopment && apiMockingEnabled) return 'mock-api';
  return isDevelopment ? 'preview' : 'disabled';
}

export function getCartHref(mode: CartWriteMode) {
  return mode === 'preview' ? '/cart?preview=local' : '/cart';
}

export const CART_WRITE_MODE = getCartWriteMode({
  apiEnabled: process.env.NEXT_PUBLIC_CART_WRITE_API_ENABLED === 'enabled',
  apiMockingEnabled: process.env.NEXT_PUBLIC_API_MOCKING === 'enabled',
  isDevelopment: process.env.NODE_ENV === 'development',
});

export const CART_HREF = getCartHref(CART_WRITE_MODE);
