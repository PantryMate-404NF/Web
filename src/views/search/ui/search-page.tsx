'use client';

import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { selectRecommendedKeyword } from '@/features/product-search/model/recommended-search-keywords';
import { RecommendedSearchKeywords } from '@/features/product-search/ui/recommended-search-keywords';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeywordSelect(keyword: string) {
    setQuery(selectRecommendedKeyword(keyword));
    inputRef.current?.focus();
  }

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-[390px] pt-14">
      <form className="flex items-center gap-3 px-4" role="search">
        <Link
          aria-label="홈으로 돌아가기"
          className="bg-muted grid size-10 shrink-0 place-items-center rounded-full"
          href="/"
        >
          <ArrowLeft aria-hidden="true" className="text-muted-foreground size-4" />
        </Link>
        <label className="bg-muted flex h-10 flex-1 items-center gap-2 rounded-lg px-4">
          <Search aria-hidden="true" className="text-muted-foreground size-4" />
          <span className="sr-only">상품 검색</span>
          <input
            autoFocus
            className="text-body-4 placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색어를 입력해주세요"
            ref={inputRef}
            value={query}
          />
        </label>
      </form>
      <RecommendedSearchKeywords onSelect={handleKeywordSelect} />
    </main>
  );
}
