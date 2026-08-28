import { CartPage } from '@/views/cart/ui/cart-page';

interface CartRouteProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function CartRoute({ searchParams }: CartRouteProps) {
  const { from } = await searchParams;

  return <CartPage from={from} />;
}
