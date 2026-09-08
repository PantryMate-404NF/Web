import { ChevronRight, Expand, Heart, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';

import { relatedProductMocks } from '@/entities/product/model/mock';
import type { ProductDetail } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui/product-card';
import { BackButton } from '@/shared/ui/back-button';

interface ProductDetailPageProps {
  product: ProductDetail;
}

interface ProductInfoRowProps {
  label: string;
  value: string;
}

function ProductInfoRow({ label, value }: ProductInfoRowProps) {
  return (
    <div className="text-body-4 flex gap-4">
      <dt className="text-muted-foreground w-20 shrink-0">{label}</dt>
      <dd className="text-text-secondary min-w-0">{value}</dd>
    </div>
  );
}

function ProductImage({ product }: { product: ProductDetail }) {
  return (
    <section
      aria-label={`${product.name} 상품 이미지`}
      className="bg-muted relative aspect-square w-full"
      role="img"
    >
      {!product.isAvailable ? (
        <div className="bg-foreground/55 absolute inset-0 grid place-items-center px-6 text-center">
          <p className="text-title-3 text-background font-semibold">판매 중인 상품이 아니에요</p>
        </div>
      ) : null}
      <div
        aria-label="상품 이미지 1 / 4"
        className="absolute right-1/2 bottom-3 flex translate-x-1/2 gap-1.5"
      >
        {[0, 1, 2, 3].map((index) => (
          <span
            aria-current={index === 0 ? 'true' : undefined}
            className="bg-background/50 aria-[current=true]:bg-background h-2 w-2 rounded-full aria-[current=true]:w-5"
            key={index}
          />
        ))}
      </div>
    </section>
  );
}

function RelatedProducts() {
  return (
    <section className="border-border border-t-8 px-4 py-6" id="related-products">
      <div className="flex items-center justify-between">
        <h2 className="text-title-3 font-bold">다른 고객이 많이 본 연관 상품</h2>
        <button className="text-body-4 text-muted-foreground flex items-center" type="button">
          더보기
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
      <div className="mt-4 flex [scrollbar-width:none] gap-3 overflow-x-auto pb-1">
        {relatedProductMocks.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </section>
  );
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const detailRows = [
    { label: '판매단위', value: product.saleUnit },
    { label: '중량/용량', value: product.weight },
    { label: '원산지', value: product.origin },
  ];

  return (
    <main className="mobile-page bg-background pb-32">
      <header className="bg-background flex h-14 items-center justify-between px-4">
        <BackButton />
        <Link
          aria-label="장바구니로 이동"
          className="focus-visible:ring-ring grid size-10 place-items-center rounded-full focus-visible:ring-2"
          href="/cart"
        >
          <ShoppingCart aria-hidden="true" className="size-6" />
        </Link>
      </header>

      <ProductImage product={product} />

      <section className="relative px-4 py-5">
        <div className="absolute top-3 right-4 flex">
          <button
            aria-label={`${product.name} 찜하기`}
            className="focus-visible:ring-ring grid size-10 place-items-center rounded-full focus-visible:ring-2"
            type="button"
          >
            <Heart aria-hidden="true" className="size-6" />
          </button>
          <button
            aria-label="상품 이미지 전체 화면으로 보기"
            className="focus-visible:ring-ring grid size-10 place-items-center rounded-full focus-visible:ring-2"
            type="button"
          >
            <Expand aria-hidden="true" className="size-6" />
          </button>
        </div>
        <span className="bg-muted text-label-4 text-muted-foreground inline-flex rounded px-2 py-1">
          {product.category}
        </span>
        <h1 className="text-title-3 mt-3 pr-20 font-bold">{product.name}</h1>
        <p className="text-body-4 text-text-secondary mt-2">{product.summary}</p>
        <p className="text-title-2 mt-4 font-bold">{product.price.toLocaleString()}원</p>
        <div
          className="text-label-4 text-text-secondary mt-2 flex items-center gap-1"
          aria-label={`평점 ${product.rating}점, 리뷰 ${product.reviewCount}개`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              aria-hidden="true"
              className={`size-3 ${index < Math.floor(product.rating) ? 'fill-foreground text-foreground' : 'fill-muted text-muted'}`}
              key={index}
            />
          ))}
          <span>리뷰 {product.reviewCount}개</span>
        </div>
      </section>

      <section className="border-border border-t-8 px-4 py-5">
        <h2 className="sr-only">배송 및 판매 정보</h2>
        <dl className="space-y-3">
          <ProductInfoRow label="배송" value={product.delivery} />
          <ProductInfoRow label="배송비" value={product.deliveryFee} />
          <ProductInfoRow label="판매자" value={product.seller} />
          <ProductInfoRow label="보관법" value={product.storageMethod} />
        </dl>
      </section>

      <RelatedProducts />

      <section className="border-border border-t-8 px-4 py-6" id="product-detail">
        <h2 className="text-title-3 font-bold">상품 상세</h2>
        <dl className="mt-5 space-y-3">
          {detailRows.map((row) => (
            <ProductInfoRow key={row.label} {...row} />
          ))}
        </dl>
        <div aria-label="상품 상세 이미지" className="bg-muted mt-6 h-56 rounded-lg" role="img" />
      </section>

      <footer className="bg-background border-border fixed right-0 bottom-0 left-0 z-10 mx-auto w-full max-w-[var(--layout-mobile-design-frame)] border-t">
        <nav aria-label="상품 상세 이동" className="flex justify-around border-b px-2">
          {[
            ['상품 상세', '#product-detail'],
            ['상품안내', '#product-detail'],
            ['상세정보', '#product-detail'],
            ['리뷰', '#related-products'],
            ['문의', '#related-products'],
          ].map(([label, href]) => (
            <a className="text-label-4 py-3 font-medium" href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex gap-2 px-4 py-3">
          <button
            className="bg-muted text-muted-foreground text-label-3 h-12 flex-1 rounded-lg font-semibold"
            disabled
            type="button"
          >
            장바구니
          </button>
          <button
            className="bg-muted text-muted-foreground text-label-3 h-12 flex-1 rounded-lg font-semibold"
            disabled
            type="button"
          >
            구매하기
          </button>
        </div>
      </footer>
    </main>
  );
}
