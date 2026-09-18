/**
 * Swagger 팬트리 목록 요청과 query string 생성 담당함
 */

import { request } from '@/shared/api/http-client';
import type { PantryItemDto } from './pantry.dto';

export interface PantryListFilters {
  storageType?: 'REFRIGERATED' | 'FROZEN' | 'ROOM_TEMP';
  sort?: 'RECENT' | 'IMMINENT' | 'OLDEST';
}

export function getPantries(filters: PantryListFilters = {}) {
  const searchParams = new URLSearchParams();
  if (filters.storageType) searchParams.set('storageType', filters.storageType);
  if (filters.sort) searchParams.set('sort', filters.sort);
  const query = searchParams.toString();

  return request<PantryItemDto[]>(`/api/pantry-items${query ? `?${query}` : ''}`);
}
