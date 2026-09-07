/**
 * TanStack Query로 팬트리 목록의 서버 상태를 관리.
 * 목록 데이터, 로딩, 오류, 재시도 기능을 Pantry 화면에 제공.
 */

import { useQuery } from '@tanstack/react-query';
import { getPantries } from '@/entities/pantry/api/get-pantries';
import { toPantryItem } from '@/entities/pantry/api/pantry.mapper';

export function usePantryQuery() {
  return useQuery({
    queryKey: ['pantry', 'list'],
    queryFn: getPantries,
    select: (items) => items.map(toPantryItem),
  });
}
