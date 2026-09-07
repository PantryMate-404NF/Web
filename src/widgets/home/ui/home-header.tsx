import { UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HomeHeader({ isAuthenticated = true }: { isAuthenticated?: boolean }) {
  return (
    <header className="flex h-14 items-center justify-between px-4">
      <Link
        aria-label="마이페이지"
        className="bg-muted grid size-8 place-items-center rounded-full"
        href={isAuthenticated ? '/' : '/login'}
      >
        <UserRound aria-hidden="true" className="text-muted-foreground size-4" />
      </Link>
      <div className="flex items-center">
        <Link aria-label="알림" className="grid size-10 place-items-center p-2" href="/">
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/icons/header/Icon-Bell.svg"
            width={24}
          />
        </Link>
        <Link aria-label="장바구니" className="grid size-10 place-items-center p-2" href="/cart">
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/icons/header/Icon-Cart.svg"
            width={24}
          />
        </Link>
      </div>
    </header>
  );
}
