import { Bell, ShoppingCart, UserRound } from 'lucide-react';
import Link from 'next/link';

export function HomeHeader() {
  return (
    <header className="flex h-14 items-center justify-between px-4">
      <Link
        aria-label="마이페이지"
        className="bg-muted grid size-8 place-items-center rounded-full"
        href="/"
      >
        <UserRound aria-hidden="true" className="text-muted-foreground size-4" />
      </Link>
      <div className="flex items-center gap-3">
        <Link aria-label="알림" className="grid size-8 place-items-center" href="/">
          <Bell aria-hidden="true" className="size-4" />
        </Link>
        <Link aria-label="장바구니" className="grid size-8 place-items-center" href="/cart">
          <ShoppingCart aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </header>
  );
}
