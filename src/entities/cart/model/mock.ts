import type { CartItem } from './types';

export const cartItemMocks: CartItem[] = [
  {
    id: 'pork-shoulder',
    name: '무항생제 돼지고기 앞다리살',
    quantityLabel: '300g',
    price: 8900,
    source: 'recipe',
  },
  {
    id: 'firm-tofu',
    name: '국산콩 단단한 두부',
    quantityLabel: '300g',
    price: 2480,
    source: 'recipe',
  },
];

export function getCartTotal(items: CartItem[] = cartItemMocks) {
  return items.reduce((total, item) => total + item.price, 0);
}
