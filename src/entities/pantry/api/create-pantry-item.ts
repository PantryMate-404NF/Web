/** 팬트리 식재료 수기 등록 요청 담당함 */

import { request } from '@/shared/api/http-client';

import type { CreatePantryItemRequest, PantryItemDto } from './pantry.dto';

export function createPantryItem(payload: CreatePantryItemRequest) {
  return request<PantryItemDto>('/api/pantry-items', { body: payload, method: 'POST' });
}
