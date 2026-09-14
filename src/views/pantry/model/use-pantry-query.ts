/**
 * TanStack Query로 팬트리 목록의 서버 상태를 관리.
 * 목록 데이터, 로딩, 오류, 재시도 기능을 Pantry 화면에 제공.
 */

import { PANTRY_QUERY_KEY, usePantriesQuery } from '@/entities/pantry/api/use-pantries-query';

export { PANTRY_QUERY_KEY };

export function usePantryQuery() {
  return usePantriesQuery();
}
