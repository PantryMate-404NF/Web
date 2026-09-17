/** 팬트리 식재료 수정 요청 담당함 */

import { request } from '@/shared/api/http-client';

import type { PantryItemDto, UpdatePantryItemRequest } from './pantry.dto';

export function updatePantryItem(pantryItemId: string, payload: UpdatePantryItemRequest) {
  return request<PantryItemDto>(`/api/pantry-items/${pantryItemId}`, {
    body: payload,
    method: 'PATCH',
  });
}
