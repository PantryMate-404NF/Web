/** 팬트리 식재료 단건 삭제 요청 담당함 */

import { request } from '@/shared/api/http-client';

export async function deletePantryItem(pantryItemId: string) {
  await request<unknown>(`/api/pantry-items/${pantryItemId}`, { method: 'DELETE' });
}
