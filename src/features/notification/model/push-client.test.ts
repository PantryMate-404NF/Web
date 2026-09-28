import { afterEach, describe, expect, it, vi } from 'vitest';

const { getAppsMock, initializeAppMock, getMessagingMock, getTokenMock, isSupportedMock } =
  vi.hoisted(() => ({
    getAppsMock: vi.fn(() => []),
    initializeAppMock: vi.fn(() => ({ name: '[DEFAULT]' })),
    getMessagingMock: vi.fn(() => ({ app: 'firebase-app' })),
    getTokenMock: vi.fn(),
    isSupportedMock: vi.fn(),
  }));

vi.mock('firebase/app', () => ({
  getApps: getAppsMock,
  initializeApp: initializeAppMock,
}));

vi.mock('firebase/messaging', () => ({
  getMessaging: getMessagingMock,
  getToken: getTokenMock,
  isSupported: isSupportedMock,
}));

describe('push client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns no token during server rendering without importing browser messaging behavior', async () => {
    const { getTokenForGrantedPermission } = await import('./push-client');

    await expect(getTokenForGrantedPermission()).resolves.toBeNull();
    expect(isSupportedMock).not.toHaveBeenCalled();
  });

  it.each(['default', 'denied'])(
    'does not prompt or get a token when permission is %s',
    async (permission) => {
      vi.stubGlobal('window', { PushManager: class PushManager {}, indexedDB: {} });
      vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn() } });
      vi.stubGlobal('Notification', {
        permission,
        requestPermission: vi.fn(),
      });
      isSupportedMock.mockResolvedValue(true);

      const { getTokenForGrantedPermission } = await import('./push-client');

      await expect(getTokenForGrantedPermission()).resolves.toBeNull();
      expect(Notification.requestPermission).not.toHaveBeenCalled();
      expect(getTokenMock).not.toHaveBeenCalled();
    },
  );

  it('requests permission only from the explicit action and gets a token from the existing service worker', async () => {
    const registration = { scope: 'https://pantry.test/' } as ServiceWorkerRegistration;
    const register = vi.fn().mockResolvedValue(registration);
    const requestPermission = vi.fn().mockResolvedValue('granted');
    vi.stubGlobal('window', { PushManager: class PushManager {}, indexedDB: {} });
    vi.stubGlobal('navigator', { serviceWorker: { register } });
    vi.stubGlobal('Notification', { permission: 'default', requestPermission });
    isSupportedMock.mockResolvedValue(true);
    getTokenMock.mockResolvedValue('issued-fcm-token');

    const { requestPushPermissionAndGetToken } = await import('./push-client');

    await expect(requestPushPermissionAndGetToken()).resolves.toBe('issued-fcm-token');

    expect(requestPermission).toHaveBeenCalledOnce();
    expect(register).toHaveBeenCalledWith('/sw.js');
    expect(getTokenMock).toHaveBeenCalledWith(
      { app: 'firebase-app' },
      expect.objectContaining({ serviceWorkerRegistration: registration }),
    );
  });

  it('gets a token automatically when permission was already granted', async () => {
    const registration = { scope: 'https://pantry.test/' } as ServiceWorkerRegistration;
    const register = vi.fn().mockResolvedValue(registration);
    const requestPermission = vi.fn();
    vi.stubGlobal('window', { PushManager: class PushManager {}, indexedDB: {} });
    vi.stubGlobal('navigator', { serviceWorker: { register } });
    vi.stubGlobal('Notification', { permission: 'granted', requestPermission });
    isSupportedMock.mockResolvedValue(true);
    getTokenMock.mockResolvedValue('existing-permission-token');

    const { getTokenForGrantedPermission } = await import('./push-client');

    await expect(getTokenForGrantedPermission()).resolves.toBe('existing-permission-token');

    expect(requestPermission).not.toHaveBeenCalled();
    expect(register).toHaveBeenCalledWith('/sw.js');
    expect(getTokenMock).toHaveBeenCalledWith(
      { app: 'firebase-app' },
      expect.objectContaining({ serviceWorkerRegistration: registration }),
    );
  });

  it('does not request notification permission when web messaging is unsupported', async () => {
    const requestPermission = vi.fn();
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn() } });
    vi.stubGlobal('Notification', { permission: 'default', requestPermission });
    isSupportedMock.mockResolvedValue(false);

    const { requestPushPermissionAndGetToken } = await import('./push-client');

    await expect(requestPushPermissionAndGetToken()).resolves.toBeNull();
    expect(requestPermission).not.toHaveBeenCalled();
    expect(getTokenMock).not.toHaveBeenCalled();
  });

  it('starts the permission request synchronously before awaiting Firebase support checks', async () => {
    const calls: string[] = [];
    const requestPermission = vi.fn(() => {
      calls.push('permission');
      return Promise.resolve('granted' as NotificationPermission);
    });
    vi.stubGlobal('window', { PushManager: class PushManager {}, indexedDB: {} });
    vi.stubGlobal('navigator', { serviceWorker: { register: vi.fn().mockResolvedValue({}) } });
    vi.stubGlobal('Notification', { permission: 'default', requestPermission });
    isSupportedMock.mockImplementation(async () => {
      calls.push('firebase-support');
      return true;
    });
    getTokenMock.mockResolvedValue('issued-fcm-token');

    const { requestPushPermissionAndGetToken } = await import('./push-client');

    await requestPushPermissionAndGetToken();

    expect(calls.slice(0, 2)).toEqual(['permission', 'firebase-support']);
  });
});
