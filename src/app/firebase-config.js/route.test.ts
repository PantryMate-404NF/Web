import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'pantry.test.firebaseapp.com',
  projectId: 'pantry-test',
  storageBucket: 'pantry-test.firebasestorage.app',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:test-app',
  measurementId: 'G-TEST',
};

function setFirebaseEnvironment() {
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', firebaseConfig.appId);
  vi.stubEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', firebaseConfig.measurementId);
}

describe('Firebase service worker configuration route', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the Firebase project configuration as executable JavaScript', async () => {
    setFirebaseEnvironment();

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('javascript');
    await expect(response.text()).resolves.toBe(
      `self.firebaseConfig = ${JSON.stringify(firebaseConfig)};`,
    );
  });

  it('does not serve an incomplete Firebase configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_API_KEY', '');

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.text()).resolves.toBe('Firebase web configuration is unavailable.');
  });
});
