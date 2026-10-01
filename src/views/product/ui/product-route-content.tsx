'use client';

import { notFound } from 'next/navigation';

import { useProductDetailQuery } from '@/entities/product/api/use-product-detail-query';
import { getProductById } from '@/entities/product/model/mock';
import { CART_WRITE_MODE } from '@/shared/config/cart-write-mode';
import { Skeleton } from '@/shared/ui/skeleton';
import { SystemErrorState } from '@/shared/ui/system-error-state';

import { ProductDetailPage } from './product-detail-page';

function ProductDetailLoadingSkeleton() {
  return (
    <main aria-busy="true" className="mobile-page bg-background min-h-dvh" role="status">
      <span className="sr-only">상품 상세를 불러오는 중입니다.</span>
      <header className="flex h-10 items-center justify-between px-4">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="size-6 rounded-full" />
      </header>
      <div className="flex h-12 items-center gap-4 px-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-4 flex-1 rounded" key={index} />
        ))}
      </div>
      <Skeleton className="aspect-square w-full rounded-none" />
      <section className="flex h-[186px] flex-col gap-3 px-4 py-4">
        <Skeleton className="h-[26px] w-20 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-7 w-28 rounded" />
      </section>
      <Skeleton className="h-2 w-full rounded-none" />
      <section className="space-y-3 px-4 py-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-5 w-full rounded" key={index} />
        ))}
      </section>
    </main>
  );
}

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
    return <ProductDetailLoadingSkeleton />;
  }

  if (shouldQuery && !data) {
    return (
      <main className="mobile-page bg-background flex min-h-dvh flex-col">
        <SystemErrorState onRetry={() => void refetch()} title="상품을 불러오지 못했어요" />
      </main>
    );
  }

  return (
    <ProductDetailPage
      onRefreshRetry={() => void refetch()}
      product={data ?? fallbackProduct}
      refreshError={shouldQuery && Boolean(error) && Boolean(data)}
    />
  );
}
