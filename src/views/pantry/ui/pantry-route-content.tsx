/**
 * /pantry 라우트에서 TanStack Query 결과를 팬트리 화면 상태로 연결합니다.
 * URL에서 해석한 카드 표시 방식만 받아 화면 조합과 라우팅 책임을 분리합니다.
 */
'use client';

import { usePantryQuery } from '../model/use-pantry-query';
import { PantryPage } from './pantry-page';

interface PantryRouteContentProps {
  view?: string;
}

export function PantryRouteContent({ view }: PantryRouteContentProps) {
  const { data, error, isPending, refetch } = usePantryQuery();
  const errorMessage =
    error instanceof Error ? error.message : error ? '팬트리를 불러오지 못했어요.' : undefined;

  return (
    <PantryPage
      cardVariant={view === 'icon' ? 'icon' : 'image'}
      errorMessage={errorMessage}
      isLoading={isPending}
      items={data ?? []}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}
