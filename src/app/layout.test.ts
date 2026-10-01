import { describe, expect, it } from 'vitest';

import { metadata, viewport } from './layout';

describe('metadata', () => {
  it('링크 공유용 PantryMate 메타데이터를 제공한다', () => {
    expect(metadata.metadataBase?.toString()).toBe('https://www.unzipp.cloud/');
    expect(metadata).toMatchObject({
      title: 'PantryMate',
      description: '우리 집 식재료로 오늘의 메뉴를 추천받고, 부족한 재료까지 간편하게 구매하세요.',
      applicationName: 'PantryMate',
      openGraph: {
        title: 'PantryMate',
        description:
          '우리 집 식재료로 오늘의 메뉴를 추천받고, 부족한 재료까지 간편하게 구매하세요.',
        siteName: 'PantryMate',
        type: 'website',
        url: '/',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'PantryMate',
        description:
          '우리 집 식재료로 오늘의 메뉴를 추천받고, 부족한 재료까지 간편하게 구매하세요.',
      },
    });
  });
});

describe('viewport', () => {
  it('iOS Safari 상태 바를 흰색으로 표시한다', () => {
    expect(viewport.themeColor).toBe('#FFFFFF');
  });
});
