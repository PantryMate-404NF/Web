'use client';

import { recommendedSearchKeywords } from '@/features/product-search/model/recommended-search-keywords';

interface RecommendedSearchKeywordsProps {
  onSelect: (keyword: string) => void;
}

export function RecommendedSearchKeywords({ onSelect }: RecommendedSearchKeywordsProps) {
  const keywordRows = [
    recommendedSearchKeywords.slice(0, 4),
    recommendedSearchKeywords.slice(4, 8),
    recommendedSearchKeywords.slice(8),
  ];

  return (
    <section className="mt-2">
      <div className="flex h-[49px] items-center px-4 min-[390px]:px-7">
        <h1 className="text-title-3 font-medium">추천 검색어</h1>
      </div>
      <div className="flex flex-col items-start gap-2 px-4 min-[390px]:px-7">
        {keywordRows.map((keywords) => (
          <div className="flex gap-2" key={keywords[0]}>
            {keywords.map((keyword) => (
              <button
                className="text-body-3 focus-visible:ring-ring shrink-0 rounded-full border border-[var(--primitive-grey-300)] px-4 py-1.5 leading-6 font-normal whitespace-nowrap focus-visible:ring-2"
                key={keyword}
                onClick={() => onSelect(keyword)}
                type="button"
              >
                {keyword}
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
