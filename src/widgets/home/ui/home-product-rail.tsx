import Image from 'next/image';
import Link from 'next/link';

import type { HomeProductItem } from '../model/home-content';
import { HomeSectionHeading } from './home-section-heading';

interface HomeProductRailProps {
  description: string;
  items: HomeProductItem[];
  productNameTone: 'primary' | 'secondary';
  title: string;
}

export function HomeProductRail({
  description,
  items,
  productNameTone,
  title,
}: HomeProductRailProps) {
  return (
    <section className="pl-4">
      <div className="pr-0">
        <HomeSectionHeading
          description={description}
          descriptionTone="tertiary"
          href="/search"
          title={title}
        />
      </div>
      <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto">
        {items.map((product) => (
          <article className="w-[164px] shrink-0" key={product.id}>
            <div className="relative size-[164px]">
              <Link
                aria-describedby={`${product.id}-price ${product.id}-unit`}
                aria-label={`${product.name} 상품 상세 보기`}
                className="focus-visible:ring-ring relative block size-full rounded-lg focus-visible:ring-2"
                href={`/product/${product.id}`}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="rounded-lg object-cover"
                  fill
                  sizes="164px"
                  src={product.imageSrc}
                />
              </Link>
              <span
                aria-hidden="true"
                className="bg-background/80 absolute top-2 right-2 grid size-8 place-items-center rounded-full"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  height={16}
                  src="/icons/home/product-cart.svg"
                  width={16}
                />
              </span>
            </div>
            <Link className="mt-2 block" href={`/product/${product.id}`}>
              <span
                className={`${productNameTone === 'primary' ? 'text-foreground' : 'text-text-secondary'} block truncate text-sm leading-[21px] font-medium`}
              >
                {product.name}
              </span>
              <strong className="text-title-3 block font-bold" id={`${product.id}-price`}>
                {product.price.toLocaleString()}원
              </strong>
              <span
                className="text-disabled block text-xs leading-[18px]"
                id={`${product.id}-unit`}
              >
                {product.unit}
              </span>
              <span className="mt-2 inline-flex h-5 items-center rounded px-2 text-xs leading-[18px] [background:var(--primitive-primary-300)]">
                4만원 이상 무료배송
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
