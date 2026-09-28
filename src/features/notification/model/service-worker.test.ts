import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { firebaseConfig } from '@/shared/config/firebase';

type ServiceWorkerEventHandler = (event: Record<string, unknown>) => void;
type BackgroundMessageHandler = (payload: {
  data?: Record<string, string>;
}) => Promise<void> | void;

function loadServiceWorker() {
  const listeners = new Map<string, ServiceWorkerEventHandler>();
  let backgroundMessageHandler: BackgroundMessageHandler | null = null;
  let initializedFirebaseConfig: Record<string, string> | null = null;
  const showNotification = vi.fn().mockResolvedValue(undefined);
  const client = {
    url: 'https://pantry.test/',
    navigate: vi.fn().mockResolvedValue(undefined),
    focus: vi.fn().mockResolvedValue(undefined),
  };
  const clients = {
    matchAll: vi.fn().mockResolvedValue([client]),
    openWindow: vi.fn().mockResolvedValue(undefined),
  };
  const firebase = {
    apps: [] as unknown[],
    initializeApp: vi.fn(function (this: { apps: unknown[] }, config: Record<string, string>) {
      initializedFirebaseConfig = config;
      this.apps.push({ name: '[DEFAULT]' });
    }),
    messaging: vi.fn(() => ({
      onBackgroundMessage: (handler: BackgroundMessageHandler) => {
        backgroundMessageHandler = handler;
      },
    })),
  };
  const self = {
    addEventListener: (type: string, handler: ServiceWorkerEventHandler) => {
      listeners.set(type, handler);
    },
    clients,
    location: { origin: 'https://pantry.test' },
    registration: { showNotification },
  };
  const source = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');

  runInNewContext(source, {
    URL,
    firebase,
    importScripts: vi.fn(),
    self,
  });

  return {
    backgroundMessageHandler: () => backgroundMessageHandler,
    client,
    clients,
    initializedFirebaseConfig: () => initializedFirebaseConfig,
    listeners,
    showNotification,
  };
}

describe('PWA service worker notifications', () => {
  it('registers Firebase background messaging and notification click handlers', () => {
    const worker = loadServiceWorker();

    expect(worker.backgroundMessageHandler()).toBeTypeOf('function');
    expect(worker.listeners.get('notificationclick')).toBeTypeOf('function');
  });

  it('uses the same Firebase project configuration as the browser client', () => {
    const worker = loadServiceWorker();

    expect(worker.initializedFirebaseConfig()).toEqual(firebaseConfig);
  });

  it('shows only pantry reminder data notifications with the provided title and body', async () => {
    const worker = loadServiceWorker();
    const onBackgroundMessage = worker.backgroundMessageHandler();

    await onBackgroundMessage?.({
      data: {
        type: 'PANTRY_REMINDER',
        title: '유통기한 임박',
        body: '토마토를 확인해 주세요.',
        link: '/pantry',
      },
    });

    expect(worker.showNotification).toHaveBeenCalledWith('유통기한 임박', {
      body: '토마토를 확인해 주세요.',
      data: { link: '/pantry' },
    });
  });

  it('ignores other background message types', async () => {
    const worker = loadServiceWorker();
    const onBackgroundMessage = worker.backgroundMessageHandler();

    await onBackgroundMessage?.({ data: { type: 'OTHER', title: 'Ignore', body: 'Ignore' } });

    expect(worker.showNotification).not.toHaveBeenCalled();
  });

  it('replaces malformed notification links with the pantry route', async () => {
    const worker = loadServiceWorker();
    const onBackgroundMessage = worker.backgroundMessageHandler();

    await onBackgroundMessage?.({
      data: {
        type: 'PANTRY_REMINDER',
        title: '알림',
        body: '확인해 주세요.',
        link: 'pantry',
      },
    });

    expect(worker.showNotification).toHaveBeenCalledWith('알림', {
      body: '확인해 주세요.',
      data: { link: '/pantry' },
    });
  });

  it('navigates and focuses an existing same-origin client when an alert is clicked', async () => {
    const worker = loadServiceWorker();
    const waitUntil = vi.fn();
    const close = vi.fn();
    const clickHandler = worker.listeners.get('notificationclick');

    clickHandler?.({
      notification: { close, data: { link: '/pantry?filter=expiring' } },
      waitUntil,
    });
    await waitUntil.mock.calls[0]?.[0];

    expect(close).toHaveBeenCalledOnce();
    expect(worker.client.navigate).toHaveBeenCalledWith(
      'https://pantry.test/pantry?filter=expiring',
    );
    expect(worker.client.focus).toHaveBeenCalledOnce();
  });

  it('opens the pantry page instead of a cross-origin notification link', async () => {
    const worker = loadServiceWorker();
    worker.clients.matchAll.mockResolvedValue([]);
    const waitUntil = vi.fn();
    const clickHandler = worker.listeners.get('notificationclick');

    clickHandler?.({
      notification: { close: vi.fn(), data: { link: 'https://outside.test/phishing' } },
      waitUntil,
    });
    await waitUntil.mock.calls[0]?.[0];

    expect(worker.clients.openWindow).toHaveBeenCalledWith('https://pantry.test/pantry');
  });
});
