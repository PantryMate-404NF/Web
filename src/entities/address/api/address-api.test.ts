import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const addressResponse = {
  addressId: 1,
  recipientName: '김지웅',
  recipientPhone: '01012345678',
  zipCode: '13485',
  address: '경기도 성남시 분당구 불정로 90',
  addressDetail: '101동 1001호',
  isDefault: true,
};

function successResponse(data: unknown) {
  return new Response(
    JSON.stringify({
      status: 'SUCCESS',
      message: '성공',
      data,
      error: null,
      timestamp: '2026-09-29T00:00:00Z',
    }),
  );
}

describe('address API', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => successResponse(addressResponse)),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('내 배송지 목록을 조회한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(successResponse([addressResponse]));
    const { getAddresses } = await import('./get-addresses');

    await getAddresses();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/me/addresses',
      expect.not.objectContaining({ method: expect.anything() }),
    );
  });

  it('배송지를 등록한다', async () => {
    const { createAddress } = await import('./create-address');
    const payload = {
      recipientName: '김지웅',
      recipientPhone: '010-1234-5678',
      zipCode: '13485',
      address: '경기도 성남시 분당구 불정로 90',
      addressDetail: '101동 1001호',
      isDefault: false,
    };

    await createAddress(payload);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/me/addresses',
      expect.objectContaining({ body: JSON.stringify(payload), method: 'POST' }),
    );
  });

  it('배송지를 수정하고 기본 배송지로 설정한다', async () => {
    const { updateAddress } = await import('./update-address');
    const { setDefaultAddress } = await import('./set-default-address');
    const payload = {
      recipientName: '김지웅',
      recipientPhone: '01012345678',
      zipCode: '13485',
      address: '경기도 성남시 분당구 불정로 90',
      addressDetail: '',
    };

    await updateAddress(12, payload);
    await setDefaultAddress(12);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3000/api/users/me/addresses/12',
      expect.objectContaining({ body: JSON.stringify(payload), method: 'PATCH' }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/api/users/me/addresses/12/default',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('주문서에서 사용할 기본 배송지를 조회한다', async () => {
    const { getDefaultAddress } = await import('./get-default-address');

    await getDefaultAddress();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/me/addresses/default',
      expect.anything(),
    );
  });
});
