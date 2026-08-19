import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Pantry',
    short_name: 'AI Pantry',
    description: '구매 이력으로 시작하는 나만의 식재료 팬트리',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFBF5',
    theme_color: '#6BAA62',
    icons: [
      { src: '/icon', sizes: '192x192', type: 'image/png' },
      { src: '/icon', sizes: '512x512', type: 'image/png' },
    ],
  };
}
