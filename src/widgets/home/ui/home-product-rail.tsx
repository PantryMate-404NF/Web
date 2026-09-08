import Link from 'next/link';

import { homeProductMocks } from '@/entities/product/model/mock';

interface HomeProductRailProps {
  description?: string;
  title: string;
}

export function HomeProductRail({ description, title }: HomeProductRailProps) {
  return (
    <section className="px-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg leading-7 font-semibold">{title}</h2>
          {description ? <p className="text-medium mt-0.5 text-[#A1A1AB]">{description}</p> : null}
        </div>
        <a className="text-text-secondary text-base font-medium" href="#more">
          더보기 <span aria-hidden="true">›</span>
        </a>
      </div>
      <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
        {homeProductMocks.map((product) => (
          <Link
            aria-label={`${product} 상품 상세 보기`}
            className="focus-visible:ring-ring w-[164px] shrink-0 rounded-lg focus-visible:ring-2"
            href={`/product/${product.id}`}
            key={product.id}
          >
            <div
              aria-label={`${product.name} 이미지`}
              className="bg-muted size-[164px] rounded-lg"
              role="img"
            />
            <p className="text-muted-foreground mt-2 truncate text-sm">{product.name}</p>
            <p className="mt-0.5 text-lg font-bold">{product.price.toLocaleString()}원</p>
            <p className="mt-0.5 text-xs text-[#A1A1AB]">{product.summary}</p>
            <span className="text-label-4 text-muted-foreground mt-1 inline-flex rounded border px-1.5 py-0.5">
              4만원 이상 무료배송
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
