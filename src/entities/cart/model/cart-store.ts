import { create } from 'zustand';

export type CartProduct = {
  id: string;
  ingredient: string;
  name: string;
  price: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export function mergeCartProducts(items: CartItem[], products: CartProduct[]): CartItem[] {
  return products.reduce<CartItem[]>((nextItems, product) => {
    const itemIndex = nextItems.findIndex((item) => item.id === product.id);

    if (itemIndex === -1) {
      return [...nextItems, { ...product, quantity: 1 }];
    }

    return nextItems.map((item, index) =>
      index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }, items);
}

export function updateCartItemQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  return items.map((item) =>
    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
  );
}

export function removeCartProduct(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

type CartState = {
  items: CartItem[];
  addProducts: (products: CartProduct[]) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addProducts: (products) => set((state) => ({ items: mergeCartProducts(state.items, products) })),
  removeProduct: (productId) =>
    set((state) => ({ items: removeCartProduct(state.items, productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({ items: updateCartItemQuantity(state.items, productId, quantity) })),
}));
