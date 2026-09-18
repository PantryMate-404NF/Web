'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import {
  preventSearchSubmit,
  selectRecommendedKeyword,
} from '@/features/product-search/model/recommended-search-keywords';
import { RecommendedSearchKeywords } from '@/features/product-search/ui/recommended-search-keywords';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeywordSelect(keyword: string) {
    setQuery(selectRecommendedKeyword(keyword));
    inputRef.current?.focus();
  }

  return (
    <main className="mobile-page bg-background pt-14">
      <form className="flex items-center gap-3 px-4" onSubmit={preventSearchSubmit} role="search">
        <Link
          aria-label="홈으로 돌아가기"
          className="bg-muted grid size-10 shrink-0 place-items-center rounded-full"
          href="/"
        >
          <ArrowLeft aria-hidden="true" className="text-muted-foreground size-4" />
        </Link>
        <label className="bg-muted flex h-10 flex-1 items-center gap-2 rounded-lg px-4">
          <Image alt="" aria-hidden="true" height={24} src="/icons/search-line.svg" width={24} />
          <span className="sr-only">상품 검색</span>
          <input
            autoFocus
            className="text-body-4 placeholder:text-muted-foreground focus-visible:ring-ring min-w-0 flex-1 rounded-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
