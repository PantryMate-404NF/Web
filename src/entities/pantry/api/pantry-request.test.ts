import { describe, expect, it } from 'vitest';

import { toCreatePantryItemRequest, toUpdatePantryItemRequest } from './pantry-request';

describe('pantry item request mapping', () => {
  const formValues = {
    consumptionDate: '2026-10-02',
    expirationDate: '2026-09-25',
    imageUrl: 'blob:local-preview',
    name: '  토마토  ',
    storageType: 'REFRIGERATED' as const,
  };

  it('maps manual registration values to the Swagger create payload and excludes a local preview URL', () => {
    expect(toCreatePantryItemRequest(formValues)).toEqual({
      expiryDate: '2026-10-02',
      ingredientName: '토마토',
      sellByDate: '2026-09-25',
      storageType: 'REFRIGERATED',
    });
  });

  it('retains a server-hosted image URL for edit requests', () => {
    expect(
      toUpdatePantryItemRequest({
        ...formValues,
        imageUrl: 'https://cdn.example.com/pantry/tomato.jpg',
      }),
    ).toEqual({
      expiryDate: '2026-10-02',
      imageUrl: 'https://cdn.example.com/pantry/tomato.jpg',
      ingredientName: '토마토',
      sellByDate: '2026-09-25',
      storageType: 'REFRIGERATED',
    });
  });
});
