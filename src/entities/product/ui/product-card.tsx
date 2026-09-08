import type { RelatedProduct } from '../model/types';

interface ProductCardProps {
  product: RelatedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="w-36 shrink-0">
      <div
        aria-label={`${product.name} 이미지`}
        className="bg-muted aspect-square rounded-lg"
        role="img"
      />
      <p className="text-body-4 mt-2 truncate font-medium">{product.name}</p>
      <p className="text-title-4 mt-1 font-bold">{product.price.toLocaleString()}원</p>
      <p className="text-label-4 text-muted-foreground mt-0.5">{product.unitPrice}</p>
    </article>
  );
}
