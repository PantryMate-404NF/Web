import { ProductRouteContent } from '@/views/product/ui/product-route-content';

interface ProductDetailRouteProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { productId } = await params;

  return <ProductRouteContent productId={productId} />;
}
