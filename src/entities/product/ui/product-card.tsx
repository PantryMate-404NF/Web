import type { RelatedProduct } from '../model/types';
import Link from 'next/link';

interface ProductCardProps {
  product: RelatedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const content = (
    <>
      <div
        aria-label={`${product.name} 이미지`}
        className="bg-muted aspect-square rounded-lg"
        role="img"
      />
      <p className="text-body-4 mt-2 truncate font-medium">{product.name}</p>
      <p className="text-title-4 mt-1 font-bold">{product.price.toLocaleString()}원</p>
      <p className="text-label-4 text-muted-foreground mt-0.5">{product.unitPrice}</p>
    </>
  );

  return product.productId ? (
    <Link
      aria-label={`${product.name}, ${product.price.toLocaleString()}원, ${product.unitPrice} 상품 상세 보기`}
      className="focus-visible:ring-ring w-[164px] shrink-0 rounded-lg focus-visible:ring-2"
      href={`/product/${product.productId}`}
    >
      {content}
    </Link>
  ) : (
    <article className="w-[164px] shrink-0">{content}</article>
  );
}
