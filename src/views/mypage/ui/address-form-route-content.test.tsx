import { describe, expect, it, vi } from 'vitest';

import { AddressFormRouteContent } from './address-form-route-content';

const { createMutateAsyncMock, useAddressMutationsMock, useAuthSessionMock } = vi.hoisted(() => ({
  createMutateAsyncMock: vi.fn(),
  useAddressMutationsMock: vi.fn(),
  useAuthSessionMock: vi.fn(),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('@/entities/address/api/use-address-mutations', () => ({
  useAddressMutations: useAddressMutationsMock,
}));

describe('AddressFormRouteContent', () => {
  it('로그인 사용자의 입력을 백엔드 등록 요청으로 변환한다', async () => {
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useAddressMutationsMock.mockReturnValue({
      create: { error: null, isPending: false, mutateAsync: createMutateAsyncMock },
    });
    const form = {
      recipientName: '김지웅',
      phoneNumber: '010-1234-5678',
      postalCode: '13485',
      addressLine1: '경기도 성남시 분당구 불정로 90',
      addressLine2: '101동 1001호',
      isDefault: false,
    };

    const page = AddressFormRouteContent({ returnTo: '/order' });
    await page.props.onSubmit(form);

    expect(createMutateAsyncMock).toHaveBeenCalledWith({
      recipientName: '김지웅',
      recipientPhone: '010-1234-5678',
      zipCode: '13485',
      address: '경기도 성남시 분당구 불정로 90',
      addressDetail: '101동 1001호',
      isDefault: false,
    });
  });

  it('비로그인 상태에서는 입력 폼 대신 로그인 안내를 전달한다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'guest' });
    useAddressMutationsMock.mockReturnValue({
      create: { error: null, isPending: false, mutateAsync: createMutateAsyncMock },
    });

    const page = AddressFormRouteContent({});

    expect(page.props).toMatchObject({ isUnauthorized: true });
  });
});
