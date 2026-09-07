import { Home, Refrigerator, Search, UserRound, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

const navigationItems = [
  { href: '/recipe', icon: UtensilsCrossed, label: '레시피' },
  { href: '/pantry', icon: Refrigerator, label: '팬트리' },
  { href: '/', icon: Home, label: '홈' },
  { href: '/?state=complete', icon: Search, label: '검색' },
  { href: '/', icon: UserRound, label: '마이페이지' },
];

export function HomeBottomNavigation() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="bg-background sticky bottom-0 z-10 mt-auto border-t px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]"
    >
      <div className="grid grid-cols-5">
        {navigationItems.map(({ href, icon: Icon, label }) => (
          <Link
            aria-current={label === '홈' ? 'page' : undefined}
            className="text-label-4 text-muted-foreground aria-[current=page]:text-foreground flex min-h-12 flex-col items-center justify-center gap-0.5 aria-[current=page]:font-semibold"
            href={href}
            key={label}
          >
            <Icon aria-hidden="true" className="size-4" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
