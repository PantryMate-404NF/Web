import { CART_ITEMS_MOCK } from '@/entities/cart/model/mock';
import { CartPreviewRouteContent, CartRouteContent } from '@/views/cart/ui/cart-route-content';

type CartPageProps = {
  searchParams: Promise<{ preview?: string | string[] }>;
};

export default async function CartRoute({ searchParams }: CartPageProps) {
  const { preview } = await searchParams;
  const previewItems =
    process.env.NODE_ENV === 'development' && preview === 'filled'
      ? [...CART_ITEMS_MOCK]
      : process.env.NODE_ENV === 'development' && preview === 'empty'
        ? []
        : undefined;

  return previewItems ? (
    <CartPreviewRouteContent initialItems={previewItems} />
  ) : (
    <CartRouteContent />
  );
}
