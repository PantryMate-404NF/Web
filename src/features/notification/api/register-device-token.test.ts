import { afterEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/http-client', () => ({
  request: requestMock,
}));

import { registerDeviceToken } from './register-device-token';

describe('registerDeviceToken', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('posts the FCM token to the authenticated device-token endpoint', async () => {
    requestMock.mockResolvedValue(undefined);

    await registerDeviceToken('fcm-token');

    expect(requestMock).toHaveBeenCalledWith('/api/notifications/device-token', {
      method: 'POST',
      body: { fcmToken: 'fcm-token' },
    });
  });

  it('propagates API errors so the caller can decide how to recover', async () => {
    const error = new Error('token rejected');
    requestMock.mockRejectedValue(error);

    await expect(registerDeviceToken('invalid-token')).rejects.toBe(error);
  });
});
