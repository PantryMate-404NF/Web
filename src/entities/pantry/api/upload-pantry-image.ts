/** 팬트리 식재료 이미지를 업로드하고 서버 URL을 반환함 */

import { request } from '@/shared/api/http-client';

import type { PantryImageUploadResponseDto } from './pantry.dto';

export function uploadPantryImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request<PantryImageUploadResponseDto>('/api/pantry-items/images', {
    body: formData,
    method: 'POST',
  });
}
