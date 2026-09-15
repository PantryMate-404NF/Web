export const HOME_BANNERS = [
  { id: 'gap-farm', label: 'GAP 인증 농산물 안내' },
  { id: 'spring-ingredients', label: '봄맞이 제철 식재료 안내' },
] as const;

export function getNextHomeBannerIndex(currentIndex: number, bannerCount: number) {
  if (bannerCount <= 0) return 0;

  return (currentIndex + 1) % bannerCount;
}
