'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import {
  HOME_CAROUSEL_BANNERS,
  getNextHomeBannerIndex,
  getSwipeHomeBannerIndex,
} from '../model/home-banner';
import type { HomeBanner } from '../model/home-banner';

function HomeBannerVisual({ banner, priority }: { banner: HomeBanner; priority: boolean }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="object-cover"
      fill
      priority={priority}
      sizes="(max-width: 430px) 100vw, 390px"
      src={banner.imageSrc ?? ''}
    />
  );
}

export function getCarouselPlaybackControl(isPaused: boolean) {
  return isPaused
    ? { iconSrc: '/icons/home/play.svg', label: '배너 자동 전환 재생' }
    : { iconSrc: '/icons/home/pause.svg', label: '배너 자동 전환 일시정지' };
}

export function HomePromotionCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const activeBanner = HOME_CAROUSEL_BANNERS[activeIndex] ?? HOME_CAROUSEL_BANNERS[0];
  const playbackControl = getCarouselPlaybackControl(isPaused);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => getNextHomeBannerIndex(current, HOME_CAROUSEL_BANNERS.length));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const touchStartX = touchStartXRef.current;
    const touchEndX = event.changedTouches[0]?.clientX;
    touchStartXRef.current = null;

    if (touchStartX === null || touchEndX === undefined) return;

    setActiveIndex((current) =>
      getSwipeHomeBannerIndex(current, touchEndX - touchStartX, HOME_CAROUSEL_BANNERS.length),
    );
  };

  return (
    <section
      aria-label={activeBanner.label}
      aria-roledescription="carousel"
      className="relative h-64 w-full touch-pan-y overflow-hidden"
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div
        className="flex size-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {HOME_CAROUSEL_BANNERS.map((banner, index) => (
          <div
            aria-hidden={index !== activeIndex}
            className="relative h-full min-w-full"
            key={banner.id}
          >
            <HomeBannerVisual banner={banner} priority={index === 0} />
          </div>
        ))}
      </div>
      <div className="absolute right-[18px] bottom-[18px] flex items-center gap-2.5">
        <button
          aria-label={playbackControl.label}
          className="bg-background/80 focus-visible:ring-ring grid size-9 place-items-center rounded-full focus-visible:ring-2"
          onClick={() => setIsPaused((paused) => !paused)}
          type="button"
        >
          <Image alt="" aria-hidden="true" height={24} src={playbackControl.iconSrc} width={24} />
        </button>
        <div className="bg-background/80 text-text-secondary flex h-9 items-center rounded-full pl-5">
          <span className="text-[15px] leading-[23px] font-medium">
            {activeIndex + 1}{' '}
            <span className="text-disabled">/ {HOME_CAROUSEL_BANNERS.length}</span>
          </span>
          <Link
            aria-label="프로모션 전체 보기"
            className="focus-visible:ring-ring grid size-9 place-items-center rounded-full focus-visible:ring-2"
            href="/promotion"
          >
            <Image alt="" aria-hidden="true" height={24} src="/icons/home/plus.svg" width={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}
