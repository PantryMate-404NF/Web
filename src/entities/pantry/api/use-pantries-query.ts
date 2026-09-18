/** 팬트리 목록 서버 상태와 화면 모델 변환을 관리함 */

import { useQuery } from '@tanstack/react-query';

import { toPantryItem } from './pantry.mapper';
import { getPantries, type PantryListFilters } from './get-pantries';

/** 서버에 등록된 팬트리 식재료 목록을 화면 모델로 조회합니다. */
export const PANTRY_QUERY_KEY = ['pantry', 'list'] as const;

export function usePantriesQuery(filters: PantryListFilters = {}) {
  return useQuery({
    queryKey: [...PANTRY_QUERY_KEY, filters.storageType ?? 'ALL', filters.sort ?? 'RECENT'],
    queryFn: () => getPantries(filters),
    select: (items) => items.map(toPantryItem),
  });
}
