'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import { useFavoriteProductStore } from '@/entities/product/model/favorite-store';
import type { ProductDetail } from '@/entities/product/model/types';

interface ProductFavoriteButtonProps {
  product: Pick<ProductDetail, 'id' | 'name'>;
  variant?: 'card' | 'detail';
}

function SelectedHeartIcon({ compact }: { compact: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`text-destructive ${compact ? 'h-[18px] w-[18px]' : 'h-6 w-6'}`}
      viewBox="0 0 19.5 17.46"
    >
      <path
        d="M9.75 3.90425C7.75 -0.790188 0.75 -0.290188 0.75 5.70984C0.75 11.7099 9.75 16.71 9.75 16.71C9.75 16.71 18.75 11.7099 18.75 5.70984C18.75 -0.290188 11.75 -0.790188 9.75 3.90425Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ProductFavoriteButton({ product, variant = 'detail' }: ProductFavoriteButtonProps) {
  const favoriteProductIds = useFavoriteProductStore((state) => state.favoriteProductIds);
  const hasHydrated = useFavoriteProductStore((state) => state.hasHydrated);
  const toggleFavorite = useFavoriteProductStore((state) => state.toggleFavorite);
  const isFavorite = hasHydrated && favoriteProductIds.includes(product.id);
  const compact = variant === 'card';

  useEffect(() => {
    void useFavoriteProductStore.persist.rehydrate();
  }, []);

  return (
    <button
      aria-label={`${product.name} ${isFavorite ? '찜 해제' : '찜하기'}`}
      aria-pressed={isFavorite}
      className={`focus-visible:ring-ring grid place-items-center rounded-full focus-visible:ring-2 ${compact ? 'bg-background/80 size-8' : 'h-12 w-10'}`}
      onClick={() => toggleFavorite(product.id)}
      type="button"
    >
      {isFavorite ? (
        <SelectedHeartIcon compact={compact} />
      ) : (
        <Image
          alt=""
          height={compact ? 18 : 24}
          src="/icons/product/like-line.svg"
          width={compact ? 18 : 24}
        />
      )}
    </button>
  );
}
