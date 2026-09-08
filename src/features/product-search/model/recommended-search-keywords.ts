export const recommendedSearchKeywords = [
  '카레가루',
  '두부',
  '우삼겹',
  '저당소스',
  '진간장',
  '시금치',
  '토마토',
  '달걀',
  '감자',
  '파프리카 가루',
  '알룰로스',
] as const;

export function selectRecommendedKeyword(keyword: string) {
  return keyword;
}

export function preventSearchSubmit(event: { preventDefault: () => void }) {
  event.preventDefault();
}
