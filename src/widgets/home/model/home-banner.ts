export interface HomeBanner {
  id: string;
  imageSrc?: string;
  kind: 'farm' | 'spring' | 'image';
  label: string;
  thumbnailSrc?: string;
}

export const HOME_BANNERS = [
  {
    id: 'gap-farm',
    imageSrc: '/images/home/banner-gap-farm-upscaled.png',
    kind: 'farm',
    label: 'GAP 인증 농산물 안내',
    thumbnailSrc: '/images/home/promotion-gap.png',
  },
  {
    id: 'spring-ingredients',
    imageSrc: '/images/home/banner-spring-ingredients-upscaled.png',
    kind: 'spring',
    label: '봄맞이 제철 식재료 안내',
  },
] as const satisfies readonly HomeBanner[];

export const HOME_CAROUSEL_BANNERS = HOME_BANNERS.filter(
  (banner) => banner.id === 'gap-farm' || banner.id === 'spring-ingredients',
);

export function getNextHomeBannerIndex(currentIndex: number, bannerCount: number) {
  if (bannerCount <= 0) return 0;

  return (currentIndex + 1) % bannerCount;
}

export function getPreviousHomeBannerIndex(currentIndex: number, bannerCount: number) {
  if (bannerCount <= 0) return 0;

  return (currentIndex - 1 + bannerCount) % bannerCount;
}

export function getSwipeHomeBannerIndex(
  currentIndex: number,
  distanceX: number,
  bannerCount: number,
) {
  const swipeThreshold = 40;

  if (distanceX <= -swipeThreshold) return getNextHomeBannerIndex(currentIndex, bannerCount);
  if (distanceX >= swipeThreshold) return getPreviousHomeBannerIndex(currentIndex, bannerCount);

  return currentIndex;
}
