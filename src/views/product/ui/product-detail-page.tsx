import { ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

import type { ProductDetail, RelatedProduct } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui/product-card';
import { ProductCartActions } from '@/features/product-cart/ui/product-cart-actions';
import { ProductFavoriteButton } from '@/features/product-favorite/ui/product-favorite-button';
import { BackButton } from '@/shared/ui/back-button';

interface ProductDetailPageProps {
  product: ProductDetail;
}

interface ProductInfoRowProps {
  label: string;
  value: string;
}

const frequentlyViewedProducts: RelatedProduct[] = [
  {
    id: 'soft-boiled-eggs',
    imageUrl: '/images/product-detail/frequently-viewed-1.png',
    name: '동물복지 유정 반숙란 10구',
    price: 6950,
    unitPrice: '(500g)',
  },
  {
    id: 'pan-frying-tofu',
    imageUrl: '/images/product-detail/frequently-viewed-2.png',
    name: '좋은콩 부침두부',
    price: 1700,
    productId: 'soft-tofu',
    unitPrice: '(300g)',
  },
  {
    id: 'fermented-fish-sauce',
    imageUrl: '/images/product-detail/frequently-viewed-3.png',
    name: '발효 어간장',
    price: 19900,
    unitPrice: '(490ml)',
  },
];

const comparisonProducts: RelatedProduct[] = [
  {
    id: 'potato-comparison',
    imageUrl: '/images/product-detail/comparison-1.png',
    name: '무농약이상 감자',
    price: 3000,
    productId: 'pesticide-free-potato',
    unitPrice: '(500g)',
  },
  {
    id: 'onion-comparison',
    imageUrl: '/images/product-detail/comparison-2.png',
    name: '국산 양파',
    price: 5900,
    productId: 'domestic-onion',
    unitPrice: '(1.5kg)',
  },
  {
    id: 'tofu-noodles-comparison',
    imageUrl: '/images/home/product-noodles.png',
    name: '마이노멀 국산콩 100% 메밀두부면',
    price: 5580,
    productId: 'buckwheat-tofu-noodles',
    unitPrice: '(180g x 1봉)',
  },
];

function ProductInfoRow({ label, value }: ProductInfoRowProps) {
  return (
    <div className="flex text-sm leading-[21px] font-medium">
      <dt className="text-text-tertiary w-20 shrink-0">{label}</dt>
      <dd className="text-text-secondary min-w-0">{value}</dd>
    </div>
  );
}

function ProductImage({ product }: { product: ProductDetail }) {
  const imageLabel = product.isAvailable
    ? `${product.name} 상품 이미지`
    : `${product.name} 상품 이미지, 판매 중인 상품이 아니에요`;

  return (
    <section aria-label={imageLabel} className="bg-surface-secondary relative aspect-square w-full">
      {product.imageUrl ? (
        <Image
          alt={imageLabel}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 390px) 100vw, 390px"
          src={product.imageUrl}
        />
      ) : null}
      {!product.isAvailable ? (
        <div className="bg-overlay/50 absolute inset-0 grid place-items-center px-6 text-center">
          <p className="text-title-3 text-background font-semibold">판매 중인 상품이 아니에요</p>
        </div>
      ) : null}
    </section>
  );
}

function RelatedProducts({
  id,
  products,
  title,
}: {
  id: string;
  products: RelatedProduct[];
  title: string;
}) {
  return (
    <section className="border-border relative border-t-8 p-4" id={id}>
      <div className="w-[281px]">
        <h2 className="text-title-3 leading-[27px] font-semibold">{title}</h2>
        <button
          aria-label={`${title} 더보기`}
          className="text-title-4 text-text-secondary focus-visible:ring-ring absolute top-[10px] right-0 flex h-10 items-center rounded-sm font-medium focus-visible:ring-2"
          type="button"
        >
          더보기
          <span className="grid size-10 place-items-center">
            <ChevronRight aria-hidden="true" className="size-6" />
          </span>
        </button>
      </div>
      <div className="mt-4 flex [scrollbar-width:none] gap-2 overflow-x-auto">
        {products.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </section>
  );
}

function ProductSectionNavigation() {
  const items = [
    { label: '상품안내', href: '#product-guide' },
    { label: '상세정보', href: '#product-detail' },
    { label: '리뷰' },
    { label: '문의' },
  ];

  return (
    <nav aria-label="상품 상세 이동" className="border-border flex h-12 border-b px-4">
      {items.map((item, index) =>
        item.href ? (
          <a
            aria-current={index === 0 ? 'page' : undefined}
            className={`flex flex-1 items-center justify-center border-b-2 text-base font-semibold ${
              index === 0
                ? 'border-foreground text-foreground'
                : 'text-text-secondary border-transparent'
            }`}
            href={item.href}
            key={item.label}
            style={index === 0 ? { borderBottomColor: 'var(--foreground)' } : undefined}
          >
            {item.label}
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="text-text-secondary flex flex-1 items-center justify-center border-b-2 border-transparent text-base font-semibold"
            key={item.label}
          >
            {item.label}
          </span>
        ),
      )}
    </nav>
  );
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const detailRows = [
    { label: '판매단위', value: product.saleUnit },
    { label: '중량/용량', value: product.weight },
    { label: '원산지', value: product.origin },
  ];

  return (
    <main className="mobile-page bg-background overflow-x-clip pb-[52px]">
      <header className="bg-background relative flex h-10 items-center px-2">
        <BackButton />
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">상품 상세</h1>
      </header>

      <ProductSectionNavigation />

      <div id="product-guide">
        <ProductImage product={product} />
      </div>

      <section className="relative flex h-[186px] w-full flex-col gap-2 px-4 py-4">
        <div className="absolute top-0 right-4 flex h-12 items-center">
          <ProductFavoriteButton product={product} />
          <button
            aria-label="상품 공유하기"
            className="focus-visible:ring-ring grid h-12 w-10 place-items-center rounded-full focus-visible:ring-2"
            type="button"
          >
            <Image alt="" height={24} src="/icons/product/expand-screen-line.svg" width={24} />
          </button>
        </div>
        <span className="bg-surface-secondary text-text-tertiary inline-flex self-start rounded px-2 py-1 text-xs leading-[18px]">
          {product.category}
        </span>
        <p className="text-title-3 w-full pr-20 font-bold">{product.name}</p>
        <p className="text-body-4 text-text-secondary w-full font-medium">{product.summary}</p>
        <p className="text-title-2 w-full font-semibold">{product.price.toLocaleString()}원</p>
        <div
          aria-label={`평점 ${product.rating}점, 리뷰 ${product.reviewCount}개`}
          className="text-text-secondary flex items-center gap-1 text-xs leading-[18px]"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              aria-hidden="true"
              className={`size-3 ${index < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-disabled fill-transparent'}`}
              key={index}
            />
          ))}
          <span>리뷰 {product.reviewCount}개</span>
        </div>
      </section>

      <section className="border-border border-t-8 px-4 py-4">
        <h2 className="sr-only">배송 및 판매 정보</h2>
        <dl className="space-y-2">
          <ProductInfoRow label="배송" value={product.delivery} />
          <ProductInfoRow label="배송비" value={product.deliveryFee} />
          <ProductInfoRow label="판매자" value={product.seller} />
          <ProductInfoRow label="보관법" value={product.storageMethod} />
        </dl>
      </section>

      <RelatedProducts
        id="related-products"
        products={frequentlyViewedProducts}
        title="다른 고객이 많이 본 연관 상품"
      />

      <section className="border-border border-t-8 px-4 py-4" id="product-detail">
        <h2 className="sr-only">상품 상세정보</h2>
        <dl className="space-y-2">
          {detailRows.map((row) => (
            <ProductInfoRow key={row.label} {...row} />
          ))}
        </dl>
      </section>

      <section
        aria-label="상품 상세 이미지"
        className="border-border flex flex-col gap-6 border-t-8 px-4 py-4"
      >
        {product.detailImageUrls?.map((imageUrl, index) => (
          <Image
            alt={`${product.name} 상세 정보 ${index + 1}`}
            className={`w-full object-cover ${index === 1 ? 'h-[1220px]' : index === 2 ? 'h-[835px]' : index === 3 ? 'h-[200px]' : 'h-[149px]'}`}
            height={index === 1 ? 1220 : index === 2 ? 835 : index === 3 ? 200 : 149}
            key={imageUrl}
            sizes="(max-width: 390px) calc(100vw - 32px), 358px"
            src={imageUrl}
            width={358}
          />
        ))}
      </section>

      <RelatedProducts
        id="comparison-products"
        products={comparisonProducts}
        title="이런 상품도 비교해 보세요"
      />

      <ProductCartActions product={product} />
    </main>
  );
}
