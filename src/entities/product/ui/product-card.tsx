import type { RelatedProduct } from '../model/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: RelatedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const content = (
    <>
      <div className="bg-muted relative aspect-square overflow-hidden rounded-[8px]">
        {product.imageUrl ? (
          <Image
            alt={`${product.name} 이미지`}
            className="object-cover"
            fill
            sizes="164px"
            src={product.imageUrl}
          />
        ) : (
          <span aria-label={`${product.name} 이미지`} className="block size-full" role="img" />
        )}
      </div>
      <div className="mt-2">
        <p className="text-text-secondary truncate text-sm leading-[21px] font-medium">
          {product.name}
        </p>
        <p className="text-title-3 leading-[27px] font-bold">{product.price.toLocaleString()}원</p>
        <p className="text-disabled text-xs leading-[18px]">{product.unitPrice}</p>
      </div>
    </>
  );

  return product.productId ? (
    <Link
      aria-label={`${product.name}, ${product.price.toLocaleString()}원, ${product.unitPrice} 상품 상세 보기`}
      className="focus-visible:ring-ring w-[164px] shrink-0 rounded-[8px] focus-visible:ring-2"
      href={`/product/${product.productId}`}
    >
      {content}
    </Link>
  ) : (
    <article className="w-[164px] shrink-0">{content}</article>
  );
}
