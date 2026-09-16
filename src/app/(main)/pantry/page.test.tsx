import { describe, expect, it } from 'vitest';

import PantryRoute from './page';

describe('PantryRoute', () => {
  it('renders the full pantry mock on the base route', async () => {
    const page = await PantryRoute({ searchParams: Promise.resolve({}) });

    expect(page.props).toMatchObject({ state: 'full' });
  });
});
