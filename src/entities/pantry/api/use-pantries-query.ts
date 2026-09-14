import { useQuery } from '@tanstack/react-query';

import { toPantryItem } from './pantry.mapper';
import { getPantries } from './get-pantries';

/** 서버에 등록된 팬트리 식재료 목록을 화면 모델로 조회합니다. */
export function usePantriesQuery() {
  return useQuery({
    queryKey: ['pantry', 'list'],
    queryFn: getPantries,
    select: (items) => items.map(toPantryItem),
  });
}
