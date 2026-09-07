import { describe, expect, it } from 'vitest';

import { getHomeMockState } from './home-page';

describe('getHomeMockState', () => {
  it('supports each documented home wireframe state', () => {
    expect(getHomeMockState('login')).toBe('login');
    expect(getHomeMockState('onboarding')).toBe('onboarding');
    expect(getHomeMockState('complete')).toBe('complete');
  });

  it('uses the completed onboarding home for an unsupported or missing state', () => {
    expect(getHomeMockState('unknown')).toBe('complete');
    expect(getHomeMockState()).toBe('complete');
  });
});
