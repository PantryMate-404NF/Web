import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
  /**
   * 로컬 개발에서 브라우저는 localhost만 호출하고, Next 서버가 원격 Gateway로 전달합니다.
   * OAuth state·refreshToken 쿠키를 localhost same-origin 쿠키로 유지하기 위한 프록시입니다.
   */
  async rewrites() {
    const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL?.replace(/\/+$/, '');

    if (!backendApiBaseUrl) {
      return [];
    }

    return [
      {
        destination: `${backendApiBaseUrl}/api/:path*`,
        source: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
