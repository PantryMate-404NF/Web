import { ORDER_ITEMS_MOCK } from '@/entities/order/model/mock';
import { OrderRouteContent } from '@/views/order/ui/order-route-content';

type OrderPageProps = {
  searchParams: Promise<{
    cartId?: string | string[];
    items?: string | string[];
    preview?: string | string[];
  }>;
};

export default async function OrderRoute({ searchParams }: OrderPageProps) {
  const { cartId, items, preview } = await searchParams;
  const selectedItemIds = typeof items === 'string' ? items.split(',').filter(Boolean) : [];
  const previewItems =
    process.env.NODE_ENV === 'development' && preview === '1' ? [...ORDER_ITEMS_MOCK] : undefined;
  const parsedCartId = typeof cartId === 'string' ? Number(cartId) : undefined;

  return (
    <OrderRouteContent
      cartId={Number.isInteger(parsedCartId) ? parsedCartId : undefined}
      previewItems={previewItems}
      selectedItemIds={selectedItemIds}
    />
  );
}
