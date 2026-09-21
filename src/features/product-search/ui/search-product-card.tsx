import Image from 'next/image';
import Link from 'next/link';

import type { SearchProduct } from '@/entities/product/model/types';

interface SearchProductCardProps {
  onAdd: (product: SearchProduct) => void;
  product: SearchProduct;
}

function ProductDetails({ product }: { product: SearchProduct }) {
  return (
    <div className={product.isAvailable ? undefined : 'text-disabled'}>
      <p className="truncate text-sm leading-[21px] font-medium">{product.name}</p>
      <strong className="text-title-3 block font-bold">{product.price.toLocaleString()}원</strong>
      <span className="text-disabled block text-xs leading-[18px]">{product.unit}</span>
      <span
        className={`mt-2 flex h-5 w-fit items-center rounded px-2 text-xs leading-[18px] ${
          product.isAvailable
            ? 'bg-[var(--primitive-primary-300)] text-[var(--primitive-grey-900)]'
            : 'bg-surface-disabled text-disabled'
        }`}
      >
        {product.shippingLabel}
      </span>
    </div>
  );
}

export function SearchProductCard({ onAdd, product }: SearchProductCardProps) {
  const detailsId = `${product.id}-details`;

  return (
    <article className="min-w-0" aria-labelledby={detailsId}>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        {product.detailProductId ? (
          <Link
            aria-describedby={detailsId}
            aria-label={`${product.name} 상품 상세 보기`}
            className="focus-visible:ring-ring block size-full focus-visible:ring-2 focus-visible:ring-inset"
            href={`/product/${product.detailProductId}`}
          >
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover"
              fill
              sizes="(max-width: 389px) calc((100vw - 48px) / 2), 171px"
              src={product.imageUrl}
            />
          </Link>
        ) : (
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover"
            fill
            sizes="(max-width: 389px) calc((100vw - 48px) / 2), 171px"
            src={product.imageUrl}
          />
        )}

        {!product.isAvailable && (
          <div
            aria-label={`${product.name}, 품절`}
            className="absolute inset-0 z-10 grid place-items-center bg-[rgba(26,26,26,0.7)]"
            role="img"
          >
            <span className="text-body-1 text-text-inverse leading-[30px] font-medium">품절</span>
          </div>
        )}

        <button
          aria-label={`${product.name} 장바구니에 담기`}
          className="bg-background/80 focus-visible:ring-ring absolute top-2 right-2.5 grid size-8 place-items-center rounded-full focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!product.isAvailable}
          onClick={() => onAdd(product)}
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={16}
            src="/icons/home/product-cart.svg"
            width={16}
          />
        </button>
      </div>

      <div className="mt-2" id={detailsId}>
        {product.detailProductId ? (
          <Link
            className="focus-visible:ring-ring block rounded focus-visible:ring-2"
            href={`/product/${product.detailProductId}`}
          >
            <ProductDetails product={product} />
          </Link>
        ) : (
          <ProductDetails product={product} />
        )}
      </div>
    </article>
  );
}
