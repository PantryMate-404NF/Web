'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCartStore } from '@/entities/cart/model/cart-store';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { useAddProductToCart } from '@/features/product-cart/model/use-add-product-to-cart';
import { CART_WRITE_MODE } from '@/shared/config/cart-write-mode';

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
  const router = useRouter();
  const addPreviewProducts = useCartStore((state) => state.addProducts);
  const { restore, state: authState } = useAuthSession();
  const { addProduct, isPending, reset } = useAddProductToCart();
  const [pendingProductId, setPendingProductId] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<string>();

  async function handleCartClick(product: HomeProductItem) {
    reset();
    setPendingProductId(product.id);
    setStatusMessage(undefined);

    try {
      if (CART_WRITE_MODE === 'preview') {
        addPreviewProducts([
          {
            id: `${product.id}:default`,
            ingredient: product.unit,
            name: product.name,
            price: product.price,
            thumbnailUrl: product.imageSrc,
          },
        ]);
        router.push('/cart?preview=local');
        return;
      }

      if (CART_WRITE_MODE === 'disabled') return;

      const apiProductId =
        CART_WRITE_MODE === 'mock-api' ? product.mockCommerceProductId : product.commerceProductId;
      if (!apiProductId) {
        setStatusMessage('상품 API 정보가 아직 준비되지 않았어요.');
        return;
      }

      const resolvedAuthState = authState === 'loading' ? await restore() : authState;

      if (resolvedAuthState === 'guest') {
        router.push('/login?returnTo=%2F');
        return;
      }

      await addProduct({ productId: apiProductId, quantity: 1 });
      router.push('/cart');
    } catch (caughtError) {
      setStatusMessage(
        caughtError instanceof Error ? caughtError.message : '장바구니에 담지 못했어요.',
      );
    } finally {
      setPendingProductId(undefined);
    }
  }

  return (
    <section className="pl-4">
      {statusMessage ? (
        <p className="text-destructive mb-2 pr-4 text-sm" role="alert">
          {statusMessage}
        </p>
      ) : null}
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
              <button
                aria-label={`${product.name} 장바구니에 담고 이동`}
                className="bg-background/80 focus-visible:ring-ring absolute top-2 right-2 grid size-8 place-items-center rounded-full focus-visible:ring-2 disabled:opacity-50"
                disabled={
                  CART_WRITE_MODE === 'disabled' ||
                  (CART_WRITE_MODE === 'api' && !product.commerceProductId) ||
                  isPending ||
                  pendingProductId !== undefined
                }
                onClick={() => {
                  void handleCartClick(product);
                }}
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  height={16}
                  src="/icons/home/product-cart.svg"
                  width={16}
                />
                {pendingProductId === product.id ? <span className="sr-only">처리 중</span> : null}
              </button>
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
