export interface CartItem {
  id: string;
  name: string;
  quantityLabel: string;
  price: number;
  source: 'recipe' | 'frequent';
}
