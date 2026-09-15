import Image from 'next/image';
import Link from 'next/link';

interface HomeHeaderProps {
  isAuthenticated?: boolean;
}

export function HomeHeader({ isAuthenticated = true }: HomeHeaderProps) {
  const myPageHref = '/mypage';

  return (
    <header className="flex h-16 items-center justify-between pr-4 pl-6">
      <Link
        aria-label="마이페이지"
        className="focus-visible:ring-ring grid size-11 place-items-center rounded-full focus-visible:ring-2"
        href={isAuthenticated ? myPageHref : '/login'}
      >
        <Image alt="" aria-hidden="true" height={44} src="/icons/home/avatar.svg" width={44} />
      </Link>
      <Link
        aria-label="장바구니"
        className="focus-visible:ring-ring grid size-10 place-items-center rounded-full p-2 focus-visible:ring-2"
        href="/cart"
      >
        <Image alt="" aria-hidden="true" height={24} src="/icons/header/Icon-Cart.svg" width={24} />
      </Link>
    </header>
  );
}
