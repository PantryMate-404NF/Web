'use client';

/**
 * 현재 URL에 맞춰 Figma outline·filled 아이콘을 전환하는 앱 전역 하단 네비게이션.
 */
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { useAuthSession } from '@/features/auth/ui/auth-session-provider';

import { BOTTOM_NAVIGATION_LAYOUT, getBottomNavigationItems } from '../model/bottom-navigation';

export function BottomNavigation({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { state } = useAuthSession();
  const resolvedIsAuthenticated =
    isAuthenticated ?? (state === 'complete' || state === 'onboarding');
  const fallbackNavigationItems = getBottomNavigationItems('/', {
    isAuthenticated: resolvedIsAuthenticated,
  });

  return (
    <Suspense fallback={<BottomNavigationLinks navigationItems={fallbackNavigationItems} />}>
      <BottomNavigationContent isAuthenticated={resolvedIsAuthenticated} />
    </Suspense>
  );
}

function BottomNavigationContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const navigationItems = getBottomNavigationItems(pathname, { isAuthenticated });

  return <BottomNavigationLinks navigationItems={navigationItems} />;
}

function BottomNavigationLinks({
  navigationItems,
}: {
  navigationItems: ReturnType<typeof getBottomNavigationItems>;
}) {
  return (
    <nav
      aria-label="주요 메뉴"
      className={`bg-background relative sticky bottom-0 z-[60] mt-auto rounded-t-3xl pt-2 pb-[max(env(safe-area-inset-bottom),0.625rem)] ${BOTTOM_NAVIGATION_LAYOUT.navigationPaddingClassName}`}
    >
      <div className={`flex items-center ${BOTTOM_NAVIGATION_LAYOUT.navigationGapClassName}`}>
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
          const itemClassName = `flex flex-col items-center justify-center ${BOTTOM_NAVIGATION_LAYOUT.itemGapClassName} ${BOTTOM_NAVIGATION_LAYOUT.itemPaddingClassName} ${BOTTOM_NAVIGATION_LAYOUT.labelClassName} ${isActive ? BOTTOM_NAVIGATION_LAYOUT.selectedItemClassName : 'text-muted-foreground min-w-0 flex-1'}`;

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
      <span
        aria-hidden="true"
        className="bottom-navigation-home-indicator pointer-events-none absolute bottom-2 left-1/2 z-10 h-[5px] w-20 -translate-x-1/2 rounded-[100px] bg-[var(--primitive-black)]"
      />
    </nav>
  );
}
