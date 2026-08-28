import { describe, expect, it } from 'vitest';

import { pantryItems } from './mock';

describe('pantryItems', () => {
  it('has unique identifiers and independent expiration and availability states', () => {
    expect(pantryItems.length).toBeGreaterThan(0);
    expect(new Set(pantryItems.map((item) => item.id)).size).toBe(pantryItems.length);
    expect(pantryItems[0]).toEqual(
      expect.objectContaining({
        expirationStatus: expect.any(String),
        availability: expect.any(String),
      }),
    );
  });
});
