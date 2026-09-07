/**
 * 서버에서 팬트리 목록 원본 데이터를 조회.
 * 화면용 데이터 변환은 pantry.mapper.ts에서 담당.
 */

import { request } from '@/shared/api/http-client';
import type { PantryDto } from './pantry.dto';

export function getPantries() {
  return request<PantryDto[]>('/api/pantries');
}
