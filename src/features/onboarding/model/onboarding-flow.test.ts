import { describe, expect, it } from 'vitest';

import { canAdvanceOnboardingStep, shouldRedirectCompletedOnboarding } from './onboarding-flow';

describe('canAdvanceOnboardingStep', () => {
  it('requires a household size on the first step', () => {
    expect(canAdvanceOnboardingStep(1, { householdSize: null })).toBe(false);
    expect(canAdvanceOnboardingStep(1, { householdSize: '2인 가구' })).toBe(true);
  });

  it('requires at least one allergy response on the second step', () => {
    expect(canAdvanceOnboardingStep(2, { allergies: [] })).toBe(false);
    expect(canAdvanceOnboardingStep(2, { allergies: ['우유'] })).toBe(true);
  });

  it('allows the optional food type step to be skipped', () => {
    expect(canAdvanceOnboardingStep(3, { foodTypes: [] })).toBe(true);
  });

  it('requires at least three favorite foods on the fourth step', () => {
    expect(canAdvanceOnboardingStep(4, { favoriteFoods: ['불고기', '김치찌개'] })).toBe(false);
    expect(
      canAdvanceOnboardingStep(4, {
        favoriteFoods: ['불고기', '김치찌개', '카레라이스'],
      }),
    ).toBe(true);
  });
});

describe('shouldRedirectCompletedOnboarding', () => {
  it('keeps the onboarding preview open after completion', () => {
    expect(shouldRedirectCompletedOnboarding(true, true)).toBe(false);
  });

  it('redirects a completed user outside preview mode', () => {
    expect(shouldRedirectCompletedOnboarding(true, false)).toBe(true);
  });
});
