import { describe, expect, it } from 'vitest';

import {
  canAdvanceOnboardingStep,
  getTasteScaleGridClassName,
  getTasteSelectionPosition,
  NO_ALLERGY_OPTION,
  normalizeOnboardingCompletionValue,
  ONBOARDING_COMPLETION_VALUE,
  shouldRedirectCompletedOnboarding,
  toggleAllergySelection,
} from './onboarding-flow';

describe('getTasteSelectionPosition', () => {
  it('maps each taste rating to the center of the shared five-column scale', () => {
    expect(getTasteSelectionPosition(1)).toBe('4.74%');
    expect(getTasteSelectionPosition(2)).toBe('27.39%');
    expect(getTasteSelectionPosition(3)).toBe('49.94%');
    expect(getTasteSelectionPosition(4)).toBe('72.48%');
    expect(getTasteSelectionPosition(5)).toBe('95.26%');
  });
});

describe('getTasteScaleGridClassName', () => {
  it('shares one grid definition between the rating and expression rows', () => {
    expect(getTasteScaleGridClassName()).toBe('grid-cols-[78px_minmax(0,1fr)_48px]');
  });
});

describe('canAdvanceOnboardingStep', () => {
  it('requires a household size on the first step', () => {
    expect(canAdvanceOnboardingStep(1, { householdSize: null })).toBe(false);
    expect(canAdvanceOnboardingStep(1, { householdSize: '2인 가구' })).toBe(true);
  });

  it('requires an allergy response or a no-allergy response on the second step', () => {
    expect(canAdvanceOnboardingStep(2, { allergies: [] })).toBe(false);
    expect(canAdvanceOnboardingStep(2, { allergies: ['우유'] })).toBe(true);
    expect(canAdvanceOnboardingStep(2, { allergies: [NO_ALLERGY_OPTION] })).toBe(true);
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

describe('toggleAllergySelection', () => {
  it('clears selected allergies when no allergies is selected', () => {
    expect(toggleAllergySelection(['우유', '대두'], NO_ALLERGY_OPTION)).toEqual([
      NO_ALLERGY_OPTION,
    ]);
  });

  it('clears the no-allergy response when an allergy is selected', () => {
    expect(toggleAllergySelection([NO_ALLERGY_OPTION], '우유')).toEqual(['우유']);
  });
});

describe('onboarding completion storage', () => {
  it('uses a non-sensitive completion sentinel value', () => {
    expect(ONBOARDING_COMPLETION_VALUE).toBe('completed');
  });

  it('replaces a previously stored response with the completion sentinel', () => {
    expect(normalizeOnboardingCompletionValue('{"allergies":["우유"]}')).toBe(
      ONBOARDING_COMPLETION_VALUE,
    );
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
