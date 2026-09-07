/**
 * Pantry MSW handler가 공통 API 응답 계약과 상태별 응답을 지키는지 검증합니다.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { server } from '@/mocks/server';
import type { PantryDto } from '@/entities/pantry/api/pantry.dto';
import type { ApiResponse } from '@/shared/api/api-response';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('pantryHandlers', () => {
  it('기본 목록 요청에 공통 성공 응답을 반환한다', async () => {
    const response = await fetch('http://localhost:8080/api/pantries');
    const payload = (await response.json()) as ApiResponse<PantryDto[]>;

    expect(response.status).toBe(200);
    expect(payload.status).toBe('SUCCESS');
    expect(payload.data).toEqual([
      expect.objectContaining({ pantryId: 1, ingredientName: '대파' }),
    ]);
  });

  it('empty mock은 성공 응답과 빈 배열을 반환한다', async () => {
    const response = await fetch('http://localhost:8080/api/pantries?mock=empty');
    const payload = (await response.json()) as ApiResponse<PantryDto[]>;

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ status: 'SUCCESS', data: [] });
  });

  it('unauthorized mock은 인증 오류 응답을 반환한다', async () => {
    const response = await fetch('http://localhost:8080/api/pantries?mock=unauthorized');
    const payload = (await response.json()) as ApiResponse<PantryDto[]>;

    expect(response.status).toBe(401);
    expect(payload).toMatchObject({ status: 'ERROR', error: 'UNAUTHORIZED' });
  });

  it('error mock은 서버 오류 응답을 반환한다', async () => {
    const response = await fetch('http://localhost:8080/api/pantries?mock=error');
    const payload = (await response.json()) as ApiResponse<PantryDto[]>;

    expect(response.status).toBe(500);
    expect(payload).toMatchObject({
      status: 'ERROR',
      error: 'SYS-INTERNAL-ERROR',
    });
  });
});
