import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { productSearchMocks } from '@/entities/product/model/search-mock';

import { SearchProductCard } from './search-product-card';

describe('SearchProductCard', () => {
  it('exposes price details and an add-to-cart action for an available product', () => {
    const html = renderToStaticMarkup(
      <SearchProductCard onAdd={vi.fn()} product={productSearchMocks[0]} />,
    );

    expect(html).toContain('6,700원');
    expect(html).toContain('(10구)');
    expect(html).toContain('장바구니에 담기');
  });

  it('disables the cart action and announces sold-out state', () => {
    const soldOutProduct = productSearchMocks.find((product) => !product.isAvailable)!;
    const html = renderToStaticMarkup(
      <SearchProductCard onAdd={vi.fn()} product={soldOutProduct} />,
    );

    expect(html).toContain('품절');
    expect(html).toContain('disabled=""');
  });
});
