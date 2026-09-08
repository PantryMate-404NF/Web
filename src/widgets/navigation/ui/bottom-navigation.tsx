'use client';

/**
 * 현재 URL에 맞춰 Figma outline·filled 아이콘을 전환하는 앱 전역 하단 네비게이션.
 */
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BOTTOM_NAVIGATION_LAYOUT, getBottomNavigationItems } from '../model/bottom-navigation';

export function BottomNavigation({ isAuthenticated = true }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const navigationItems = getBottomNavigationItems(pathname, { isAuthenticated });

  return (
    <nav
      aria-label="주요 메뉴"
      className={`bg-background sticky bottom-0 z-10 mt-auto border-t pb-[max(env(safe-area-inset-bottom),0.5rem)] ${BOTTOM_NAVIGATION_LAYOUT.navigationPaddingClassName}`}
    >
      <div className="grid grid-cols-5">
        {navigationItems.map(({ href, iconSrc, id, isActive, label }) => {
          const itemContent = (
            <>
              <Image
                alt=""
                aria-hidden="true"
                height={24}
                priority={isActive}
                src={iconSrc}
                width={24}
              />
              <span>{label}</span>
            </>
          );
          const itemClassName = `text-muted-foreground aria-[current=page]:text-foreground flex min-h-12 flex-col items-center justify-center ${BOTTOM_NAVIGATION_LAYOUT.itemGapClassName} ${BOTTOM_NAVIGATION_LAYOUT.itemPaddingClassName} ${BOTTOM_NAVIGATION_LAYOUT.labelClassName}`;

          return href ? (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={itemClassName}
              href={href}
              key={id}
            >
              {itemContent}
            </Link>
          ) : (
            <span aria-disabled="true" className={itemClassName} key={id}>
              {itemContent}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
