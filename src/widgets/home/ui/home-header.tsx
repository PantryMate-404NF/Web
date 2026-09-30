'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCartItemCount } from '@/entities/cart/model/use-cart-item-count';
import { CART_HREF } from '@/shared/config/cart-write-mode';
import { CartCountBadge } from '@/shared/ui/cart-count-badge';

export function HomeHeader() {
  const cartItemCount = useCartItemCount();

  return (
    <header className="flex h-16 items-center justify-between pr-4 pl-4">
      <Link
        aria-label="홈으로 이동"
        className="focus-visible:ring-ring grid h-16 w-[151px] shrink-0 place-items-center rounded-[20px] focus-visible:ring-2"
        href="/"
      >
        <Image
          alt=""
          aria-hidden="true"
          height={64}
          src="/images/logo/pantry_logo.svg"
          width={150}
        />
      </Link>
      <Link
        aria-label={`장바구니 ${cartItemCount}개 상품`}
        className="focus-visible:ring-ring relative grid size-10 place-items-center rounded-full p-2 focus-visible:ring-2"
        href={CART_HREF}
      >
        <Image
          alt=""
          aria-hidden="true"
          height={24}
          src="/images/recipe/shopping-cart-icon.svg"
          width={24}
        />
        <CartCountBadge count={cartItemCount} />
      </Link>
    </header>
  );
}
