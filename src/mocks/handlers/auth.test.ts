import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { server } from '../server';

describe('auth handlers', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('현재 회원 탈퇴 요청을 성공 처리한다', async () => {
    const response = await fetch('http://localhost:8080/api/users/me', {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: 'SUCCESS',
      data: null,
    });
  });
});
