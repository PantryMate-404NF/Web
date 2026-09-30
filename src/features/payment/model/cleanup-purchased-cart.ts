export interface PurchasedCartCleanupDependencies {
  deleteItem: (cartItemId: number) => Promise<unknown>;
  refreshCart: () => Promise<number[]>;
}

export interface PurchasedCartCleanupResult {
  completed: boolean;
  remainingCartItemIds: number[];
}

export async function cleanupPurchasedCartItems(
  selectedCartItemIds: number[],
  { deleteItem, refreshCart }: PurchasedCartCleanupDependencies,
): Promise<PurchasedCartCleanupResult> {
  const cartItemIds = [...new Set(selectedCartItemIds)].filter(
    (cartItemId) => Number.isSafeInteger(cartItemId) && cartItemId > 0,
  );

  if (cartItemIds.length === 0) {
    return { completed: true, remainingCartItemIds: [] };
  }

  await Promise.allSettled(cartItemIds.map(async (cartItemId) => deleteItem(cartItemId)));
  let currentCartItemIds: number[] | null = null;

  try {
    currentCartItemIds = await refreshCart();
  } catch {
    // Keep the IDs retryable; payment is confirmed, but cleanup cannot be verified yet.
  }

  const remainingCartItemIds = currentCartItemIds
    ? cartItemIds.filter((cartItemId) => currentCartItemIds.includes(cartItemId))
    : cartItemIds;

  return { completed: remainingCartItemIds.length === 0, remainingCartItemIds };
}
