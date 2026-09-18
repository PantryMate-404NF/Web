'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import {
  selectFavoriteProductIds,
  useFavoriteProductStore,
} from '@/entities/product/model/favorite-store';
import { productMocks } from '@/entities/product/model/mock';
import type { ProductDetail } from '@/entities/product/model/types';
import { ProductFavoriteButton } from '@/features/product-favorite/ui/product-favorite-button';
import { BackButton } from '@/shared/ui/back-button';

import { selectFavoriteProducts } from '../model/favorite-products';

function FavoriteProductCard({ product }: { product: ProductDetail }) {
  return (
    <article className="relative min-w-0">
      <Link
        aria-label={`${product.name}, ${product.price.toLocaleString()}원, ${product.weight} 상품 상세 보기`}
        className="focus-visible:ring-ring block rounded-[8px] focus-visible:ring-2"
        href={`/product/${product.id}`}
      >
        <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-[8px]">
          {product.imageUrl ? (
            <Image alt="" className="object-cover" fill sizes="171px" src={product.imageUrl} />
          ) : (
            <span aria-hidden="true" className="block size-full" />
          )}
        </div>
        <div className="mt-2 leading-[1.5]">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-title-3 font-bold">{product.price.toLocaleString()}원</p>
          <p className="text-text-tertiary text-xs">({product.weight})</p>
        </div>
      </Link>
      <div className="absolute top-2 right-[10px]">
        <ProductFavoriteButton product={product} variant="card" />
      </div>
    </article>
  );
}

export function FavoriteProductsPage() {
  const favoriteProductIds = useFavoriteProductStore(selectFavoriteProductIds);
  const hasHydrated = useFavoriteProductStore((state) => state.hasHydrated);
  const favoriteProducts = selectFavoriteProducts(favoriteProductIds, productMocks);

  useEffect(() => {
    void useFavoriteProductStore.persist.rehydrate();
  }, []);

  return (
    <main className="mobile-page bg-background min-h-dvh">
      <header className="relative flex h-16 items-center px-2">
        <BackButton fallbackHref="/mypage" />
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">찜한 상품</h1>
      </header>

      {!hasHydrated ? (
        <div className="py-16 text-center" role="status">
          <span className="sr-only">찜한 상품을 불러오는 중입니다.</span>
        </div>
      ) : favoriteProducts.length > 0 ? (
        <section
          aria-label="찜한 상품 목록"
          className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pt-2 pb-8"
        >
          {favoriteProducts.map((product) => (
            <FavoriteProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="flex min-h-[360px] items-center justify-center px-4 text-center">
          <p className="text-text-secondary text-sm">찜한 상품이 없어요.</p>
        </section>
      )}
    </main>
  );
}
