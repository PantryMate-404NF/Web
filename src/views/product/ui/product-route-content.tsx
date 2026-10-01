'use client';

import { notFound } from 'next/navigation';

import { useProductDetailQuery } from '@/entities/product/api/use-product-detail-query';
import { getProductById } from '@/entities/product/model/mock';
import { CART_WRITE_MODE } from '@/shared/config/cart-write-mode';
import { SystemErrorState } from '@/shared/ui/system-error-state';

import { ProductDetailPage } from './product-detail-page';

export function ProductRouteContent({ productId }: { productId: string }) {
  const fallbackProduct = getProductById(productId);
  const shouldQuery = CART_WRITE_MODE === 'api' && fallbackProduct?.commerceProductId !== undefined;
  const { data, error, isPending, refetch } = useProductDetailQuery(
    fallbackProduct?.commerceProductId,
    fallbackProduct,
    shouldQuery,
  );

  if (!fallbackProduct) notFound();

  if (shouldQuery && isPending) {
    return (
      <main className="mobile-page bg-background min-h-dvh" role="status">
        <span className="sr-only">상품 상세를 불러오는 중입니다.</span>
      </main>
    );
  }

  if (shouldQuery && (error || !data)) {
    return (
      <main className="mobile-page bg-background flex min-h-dvh flex-col">
        <SystemErrorState onRetry={() => void refetch()} title="상품을 불러오지 못했어요" />
      </main>
    );
  }

  return <ProductDetailPage product={data ?? fallbackProduct} />;
}
