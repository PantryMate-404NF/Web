export type AddToCartAction = 'direct-add' | 'open-bottom-sheet' | 'unavailable';

export function resolveAddToCartAction(linkedProductCount: number): AddToCartAction {
  if (linkedProductCount === 0) {
    return 'unavailable';
  }

  return linkedProductCount === 1 ? 'direct-add' : 'open-bottom-sheet';
}
