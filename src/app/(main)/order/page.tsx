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
  const orderSearchParams = new URLSearchParams();

  if (typeof cartId === 'string') orderSearchParams.set('cartId', cartId);
  if (typeof items === 'string') orderSearchParams.set('items', items);
  if (typeof preview === 'string') orderSearchParams.set('preview', preview);

  const query = orderSearchParams.toString();
  const orderReturnTo = query ? `/order?${query}` : '/order';

  return (
    <OrderRouteContent
      cartId={Number.isInteger(parsedCartId) ? parsedCartId : undefined}
      previewItems={previewItems}
      orderReturnTo={orderReturnTo}
      selectedItemIds={selectedItemIds}
    />
  );
}
