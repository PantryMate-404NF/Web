import { describe, expect, it } from 'vitest';

import { TASTE_SCALE_END_LABEL_CLASS_NAME } from './onboarding-flow';

describe('TASTE_SCALE_END_LABEL_CLASS_NAME', () => {
  it('keeps an 8px gap between the expression scale and its end label', () => {
    expect(TASTE_SCALE_END_LABEL_CLASS_NAME).toContain('pl-2');
  });
});
