'use client';

import { recommendedSearchKeywords } from '@/features/product-search/model/recommended-search-keywords';

interface RecommendedSearchKeywordsProps {
  onSelect: (keyword: string) => void;
}

export function RecommendedSearchKeywords({ onSelect }: RecommendedSearchKeywordsProps) {
  return (
    <section className="mt-9 px-7">
      <h1 className="text-title-3 font-semibold">추천 검색어</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {recommendedSearchKeywords.map((keyword) => (
          <button
            className="text-label-3 rounded-full border px-3 py-2 font-medium"
            key={keyword}
            onClick={() => onSelect(keyword)}
            type="button"
          >
            {keyword}
          </button>
        ))}
      </div>
    </section>
  );
}
