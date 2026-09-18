import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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

    if (backendApiBaseUrl) {
      return [{ source: '/api/:path*', destination: `${backendApiBaseUrl}/api/:path*` }];
    }

    const authApiBaseUrl = process.env.AUTH_API_BASE_URL?.replace(/\/+$/, '');
    const pantryRecipeApiBaseUrl = process.env.PANTRY_RECIPE_API_BASE_URL?.replace(/\/+$/, '');
    const productApiBaseUrl = process.env.PRODUCT_API_BASE_URL?.replace(/\/+$/, '');
    const rewrites = [];

    if (productApiBaseUrl) {
      rewrites.push(
        { source: '/api/products/:path*', destination: `${productApiBaseUrl}/api/products/:path*` },
        {
          source: '/api/categories/:path*',
          destination: `${productApiBaseUrl}/api/categories/:path*`,
        },
      );
    }

    if (pantryRecipeApiBaseUrl) {
      rewrites.push(
        {
          source: '/api/pantry-items/:path*',
          destination: `${pantryRecipeApiBaseUrl}/api/pantry-items/:path*`,
        },
        {
          source: '/api/recipes/:path*',
          destination: `${pantryRecipeApiBaseUrl}/api/recipes/:path*`,
        },
      );
    }

    if (authApiBaseUrl) {
      rewrites.push({ source: '/api/:path*', destination: `${authApiBaseUrl}/api/:path*` });
    }

    return rewrites;
  },
};

export default nextConfig;
