import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { ProductDetailImages, ProductImage } from './product-detail-page';

describe('product detail images', () => {
  it('대표 이미지가 없으면 대체 UI를 표시한다', () => {
    const product = getProductById('sweet-banana');

    if (!product) throw new Error('이미지 없는 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(createElement(ProductImage, { product }));

    expect(markup).toContain('상품 이미지가 준비 중이에요');
  });

  it('상세 이미지가 없으면 빈 섹션을 렌더링하지 않는다', () => {
    const product = getProductById('sweet-banana');

    if (!product) throw new Error('상세 이미지가 없는 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(createElement(ProductDetailImages, { product }));

    expect(markup).toBe('');
  });
});
