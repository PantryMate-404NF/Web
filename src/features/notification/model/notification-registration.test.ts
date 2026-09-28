import { afterEach, describe, expect, it, vi } from 'vitest';

const { getTokenMock, requestPermissionMock, registerDeviceTokenMock, isPushSupportedMock } =
  vi.hoisted(() => ({
    getTokenMock: vi.fn(),
    requestPermissionMock: vi.fn(),
    registerDeviceTokenMock: vi.fn(),
    isPushSupportedMock: vi.fn(),
  }));

vi.mock('./push-client', () => ({
  getTokenForGrantedPermission: getTokenMock,
  requestPushPermissionAndGetToken: requestPermissionMock,
  isPushSupported: isPushSupportedMock,
}));

vi.mock('../api/register-device-token', () => ({
  registerDeviceToken: registerDeviceTokenMock,
}));

import {
  registerTokenForSession,
  requestAndRegisterDeviceToken,
} from './notification-registration';

describe('notification registration', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it.each(['loading', 'guest'])(
    'does not register a token for the %s session state',
    async (state) => {
      await expect(registerTokenForSession(state)).resolves.toBe(false);
      expect(getTokenMock).not.toHaveBeenCalled();
      expect(registerDeviceTokenMock).not.toHaveBeenCalled();
    },
  );

  it.each(['complete', 'onboarding'])(
    'registers an existing granted token for %s users',
    async (state) => {
      getTokenMock.mockResolvedValue('fcm-token');
      registerDeviceTokenMock.mockResolvedValue(undefined);

      await expect(registerTokenForSession(state)).resolves.toBe(true);
      expect(registerDeviceTokenMock).toHaveBeenCalledWith('fcm-token');
    },
  );

  it('keeps a failed automatic registration from escaping into the auth flow', async () => {
    getTokenMock.mockRejectedValue(new Error('permission API failed'));

    await expect(registerTokenForSession('complete')).resolves.toBe(false);
  });

  it('keeps a failed device-token API request from escaping into the auth flow', async () => {
    getTokenMock.mockResolvedValue('fcm-token');
    registerDeviceTokenMock.mockRejectedValue(new Error('API unavailable'));

    await expect(registerTokenForSession('complete')).resolves.toBe(false);
  });

  it('registers after an explicit permission action succeeds', async () => {
    requestPermissionMock.mockResolvedValue('fcm-token');
    registerDeviceTokenMock.mockResolvedValue(undefined);

    await expect(requestAndRegisterDeviceToken(true)).resolves.toBe('registered');
    expect(registerDeviceTokenMock).toHaveBeenCalledWith('fcm-token');
  });

  it('does not call the API when the user denies notification permission', async () => {
    vi.stubGlobal('Notification', { permission: 'denied' });
    isPushSupportedMock.mockResolvedValue(false);
    requestPermissionMock.mockResolvedValue(null);

    await expect(requestAndRegisterDeviceToken(true)).resolves.toBe('permission-denied');
    expect(isPushSupportedMock).not.toHaveBeenCalled();
    expect(registerDeviceTokenMock).not.toHaveBeenCalled();
  });

  it('reports unsupported browsers without requesting permission', async () => {
    isPushSupportedMock.mockResolvedValue(false);
    requestPermissionMock.mockResolvedValue(null);

    await expect(requestAndRegisterDeviceToken(false)).resolves.toBe('unsupported');
    expect(requestPermissionMock).not.toHaveBeenCalled();
    expect(registerDeviceTokenMock).not.toHaveBeenCalled();
  });

  it('reports a dismissed prompt when push is supported but the permission stays undecided', async () => {
    vi.stubGlobal('Notification', { permission: 'default' });
    vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn() } });
    isPushSupportedMock.mockResolvedValue(true);
    requestPermissionMock.mockResolvedValue(null);

    await expect(requestAndRegisterDeviceToken(true)).resolves.toBe('dismissed');
    expect(registerDeviceTokenMock).not.toHaveBeenCalled();
  });
});
