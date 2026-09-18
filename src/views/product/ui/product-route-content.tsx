import { notFound } from 'next/navigation';

import { getProductById } from '@/entities/product/model/mock';

import { ProductDetailPage } from './product-detail-page';

export function ProductRouteContent({ productId }: { productId: string }) {
  const product = getProductById(productId);

  if (!product) notFound();

  return <ProductDetailPage product={product} />;
}
