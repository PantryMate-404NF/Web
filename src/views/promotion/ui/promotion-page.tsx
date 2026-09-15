import Image from 'next/image';

import { BackButton } from '@/shared/ui/back-button';
import { HOME_BANNERS } from '@/widgets/home/model/home-banner';
import type { HomeBanner } from '@/widgets/home/model/home-banner';

function SpringPromotionBanner() {
  const letters = [
    { value: '봄', className: 'top-[29px] left-[86px] bg-[var(--primitive-primary-300)]' },
    { value: '맞', className: 'top-[29px] left-[117px] bg-[var(--primitive-primary-300)]' },
    { value: '이', className: 'top-[29px] left-[149px] bg-[var(--primitive-primary-300)]' },
    { value: '제', className: 'top-[58px] left-[118px] bg-primary' },
    { value: '철', className: 'top-[58px] left-[149px] bg-primary' },
    { value: '식', className: 'top-[58px] left-[180px] bg-primary' },
    { value: '재', className: 'top-[58px] left-[212px] bg-primary' },
    { value: '료', className: 'top-[58px] left-[243px] bg-primary' },
  ];

  return (
    <div className="relative size-full overflow-hidden bg-[#fff6cf]">
      <Image
        alt=""
        aria-hidden="true"
        className="absolute -top-4 -left-5 size-20 rotate-[51deg]"
        height={80}
        src="/images/home/flower-yellow.png"
        width={80}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-2 left-36 h-12 w-[38px] rotate-[41deg]"
        height={48}
        src="/images/home/flower-leaf.png"
        width={38}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-[59px] left-20 h-11 w-9 -rotate-[100deg]"
        height={44}
        src="/images/home/flower-leaf.png"
        width={36}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-[83px] left-[83px] size-4 -rotate-[14deg]"
        height={16}
        src="/images/home/flower-small.png"
        width={16}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-14 left-[283px] size-[59px] -rotate-[33deg]"
        height={59}
        src="/images/home/flower-yellow.png"
        width={59}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="absolute top-2 left-28 h-[100px] w-[141px]"
        height={100}
        src="/icons/home/banner-flower-mask.svg"
        width={141}
      />
      {letters.map(({ className, value }) => (
        <span
          aria-hidden="true"
          className={`text-media-foreground absolute grid size-[35px] place-items-center rounded-full text-[22px] leading-none font-bold ${className}`}
          key={value}
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function PromotionBanner({ banner }: { banner: HomeBanner }) {
  const imageSrc = banner.kind === 'farm' ? banner.thumbnailSrc : banner.imageSrc;

  return (
    <article
      aria-label={banner.label}
      className="relative h-[115px] w-full shrink-0 overflow-hidden rounded-xl"
      data-promotion-banner={banner.id}
    >
      {banner.kind === 'spring' ? (
        <SpringPromotionBanner />
      ) : (
        <>
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover"
            fill
            sizes="(max-width: 390px) calc(100vw - 32px), 358px"
            src={imageSrc ?? ''}
          />
          {banner.kind === 'farm' ? (
            <p className="absolute top-[18px] left-[38px] text-[16px] leading-[22px] font-medium text-[#4e7c4e]">
              우리 가족 안심 선택
              <strong className="block font-bold">GAP 인증 농산물</strong>
            </p>
          ) : null}
        </>
      )}
    </article>
  );
}

export function PromotionPage() {
  return (
    <main className="mobile-page bg-background min-h-dvh">
      <header className="relative flex h-16 items-center">
        <BackButton fallbackHref="/" label="홈으로 돌아가기" />
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">프로모션</h1>
      </header>
      <section
        aria-label="프로모션 목록"
        className="mx-auto mt-2 flex w-[358px] max-w-[calc(100%-2rem)] flex-col gap-3"
      >
        {HOME_BANNERS.map((banner) => (
          <PromotionBanner banner={banner} key={banner.id} />
        ))}
      </section>
    </main>
  );
}
