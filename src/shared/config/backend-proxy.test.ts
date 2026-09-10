import nextConfig from '../../../next.config';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Next API proxy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('브라우저의 /api 요청을 원격 Gateway의 같은 API 경로로 전달한다', async () => {
    vi.stubEnv('BACKEND_API_BASE_URL', 'http://221.166.239.233:8080');

    const config = nextConfig as typeof nextConfig & {
      rewrites?: () => Promise<Array<{ destination: string; source: string }>>;
    };

    expect(config.rewrites).toBeTypeOf('function');
    await expect(config.rewrites?.()).resolves.toContainEqual({
      destination: 'http://221.166.239.233:8080/api/:path*',
      source: '/api/:path*',
    });
  });
});
