'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { HOME_BANNERS, getNextHomeBannerIndex } from '../model/home-banner';
import type { HomeBanner } from '../model/home-banner';

function FarmBanner() {
  return (
    <div className="relative size-full overflow-hidden">
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover object-[50%_100%]"
        fill
        priority
        sizes="(max-width: 430px) 100vw, 390px"
        src="/images/home/banner-farm.png"
      />
      <p className="absolute top-[34px] left-6 text-xl leading-7 font-medium text-[#4e7c4e]">
        우리 가족 안심 선택
        <strong className="block font-bold">GAP 인증 농산물</strong>
      </p>
    </div>
  );
}

function SpringBanner() {
  const letters = [
    { value: '봄', className: 'left-[42px] top-[25px] bg-[var(--primitive-primary-300)]' },
    { value: '맞', className: 'left-[94px] top-[25px] bg-[var(--primitive-primary-300)]' },
    { value: '이', className: 'left-[146px] top-[25px] bg-[var(--primitive-primary-300)]' },
    { value: '제', className: 'left-[94px] top-[71px] bg-primary' },
    { value: '철', className: 'left-[146px] top-[71px] bg-primary' },
    { value: '식', className: 'left-[198px] top-[71px] bg-primary' },
    { value: '재', className: 'left-[250px] top-[71px] bg-primary' },
    { value: '료', className: 'left-[302px] top-[71px] bg-primary' },
  ];

  return (
    <div className="relative size-full overflow-hidden bg-[#fff6cf]">
      <Image
        alt=""
        aria-hidden="true"
        className="absolute -top-4 -left-15 rotate-[51deg]"
        height={94}
        src="/images/home/flower-yellow.png"
        width={94}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-9 left-[137px] h-auto w-[50px] rotate-[41deg]"
        height={240}
        src="/images/home/flower-leaf.png"
        width={190}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-[120px] left-8 h-auto w-14 -rotate-[100deg]"
        height={240}
        src="/images/home/flower-leaf.png"
        width={190}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-[160px] left-[38px] -rotate-[14deg]"
        height={28}
        src="/images/home/flower-small.png"
        width={28}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-[158px] left-[272px] -rotate-[22deg]"
        height={94}
        src="/images/home/flower-yellow.png"
        width={94}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-9 left-[85px]"
        height={164}
        src="/icons/home/banner-flower-mask.svg"
        width={232}
      />
      {letters.map(({ className, value }) => (
        <span
          aria-hidden="true"
          className={`absolute grid size-[58px] place-items-center rounded-full text-[28px] leading-none font-bold ${className}`}
          key={value}
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function HomeBannerVisual({ banner }: { banner: HomeBanner }) {
  if (banner.kind === 'farm') return <FarmBanner />;
  if (banner.kind === 'spring') return <SpringBanner />;

  return (
    <Image
      alt=""
      aria-hidden="true"
      className="object-cover"
      fill
      priority
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
  const activeBanner = HOME_BANNERS[activeIndex] ?? HOME_BANNERS[0];
  const playbackControl = getCarouselPlaybackControl(isPaused);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => getNextHomeBannerIndex(current, HOME_BANNERS.length));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      aria-label={activeBanner.label}
      aria-roledescription="carousel"
      className="relative h-64 w-full overflow-hidden"
    >
      <HomeBannerVisual banner={activeBanner} />
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
            {activeIndex + 1} <span className="text-disabled">/ {HOME_BANNERS.length}</span>
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
