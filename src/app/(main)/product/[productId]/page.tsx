import { getProductById } from '@/entities/product/model/mock';
import { ProductDetailPage } from '@/views/product/ui/product-detail-page';

interface ProductDetailRouteProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { productId } = await params;

  return <ProductDetailPage product={getProductById(productId)} />;
}
