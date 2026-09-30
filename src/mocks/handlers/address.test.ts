import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { UserAddressDto } from '@/entities/address/api/address.dto';
import { server } from '@/mocks/server';
import type { ApiResponse } from '@/shared/api/api-response';

import { resetAddressMock } from './address';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetAddressMock();
});
afterAll(() => server.close());

describe('addressHandlers', () => {
  it('배송지를 등록한 뒤 같은 사용자의 목록에서 조회한다', async () => {
    const headers = { Authorization: 'Bearer account-a', 'Content-Type': 'application/json' };
    const createResponse = await fetch('http://localhost:8080/api/users/me/addresses', {
      body: JSON.stringify({
        recipientName: '김지웅',
        recipientPhone: '010-1234-5678',
        zipCode: '13485',
        address: '경기도 성남시 분당구 불정로 90',
        addressDetail: '101동 1001호',
        isDefault: false,
      }),
      headers,
      method: 'POST',
    });
    const listResponse = await fetch('http://localhost:8080/api/users/me/addresses', { headers });
    const created = (await createResponse.json()) as ApiResponse<UserAddressDto>;
    const list = (await listResponse.json()) as ApiResponse<UserAddressDto[]>;

    expect(createResponse.status).toBe(201);
    expect(created.data).toMatchObject({ isDefault: true, recipientPhone: '01012345678' });
    expect(list.data).toEqual([created.data]);
  });

  it('배송지를 수정하고 기본 배송지로 설정한다', async () => {
    const headers = { Authorization: 'Bearer account-a', 'Content-Type': 'application/json' };
    const create = (name: string) =>
      fetch('http://localhost:8080/api/users/me/addresses', {
        body: JSON.stringify({
          recipientName: name,
          recipientPhone: '01012345678',
          zipCode: '13485',
          address: '경기도 성남시 분당구 불정로 90',
          addressDetail: '',
          isDefault: false,
        }),
        headers,
        method: 'POST',
      });
    await create('첫 번째');
    const secondResponse = await create('두 번째');
    const second = (await secondResponse.json()) as ApiResponse<UserAddressDto>;
    const addressId = second.data?.addressId;

    await fetch(`http://localhost:8080/api/users/me/addresses/${addressId}`, {
      body: JSON.stringify({
        recipientName: '수정된 이름',
        recipientPhone: '01099998888',
        zipCode: '06236',
        address: '서울특별시 강남구 테헤란로 123',
        addressDetail: '4층',
      }),
      headers,
      method: 'PATCH',
    });
    await fetch(`http://localhost:8080/api/users/me/addresses/${addressId}/default`, {
      headers,
      method: 'PATCH',
    });
    const defaultResponse = await fetch('http://localhost:8080/api/users/me/addresses/default', {
      headers,
    });
    const selected = (await defaultResponse.json()) as ApiResponse<UserAddressDto>;
    expect(selected.data).toMatchObject({
      recipientName: '수정된 이름',
      isDefault: true,
    });
  });
});
