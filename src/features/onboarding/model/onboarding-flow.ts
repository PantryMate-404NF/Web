export const ONBOARDING_STEPS = [1, 2, 3, 4, 5] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type OnboardingAnswers = {
  householdSize: string | null;
  allergies: string[];
  foodTypes: string[];
  favoriteFoods: string[];
  tastePreferences: Record<TastePreference, number>;
};

export type TastePreference = '짠맛' | '단맛' | '매운맛';

export const initialOnboardingAnswers: OnboardingAnswers = {
  householdSize: null,
  allergies: [],
  foodTypes: [],
  favoriteFoods: [],
  tastePreferences: {
    짠맛: 3,
    단맛: 3,
    매운맛: 3,
  },
};

type OnboardingAnswerSlice = Partial<OnboardingAnswers>;

export function canAdvanceOnboardingStep(
  step: OnboardingStep,
  answers: OnboardingAnswerSlice,
): boolean {
  if (step === 1) return Boolean(answers.householdSize);
  if (step === 2) return Boolean(answers.allergies?.length);
  if (step === 4) return (answers.favoriteFoods?.length ?? 0) >= 3;

  return true;
}

export function getNextOnboardingStep(step: OnboardingStep): OnboardingStep | null {
  return step === 5 ? null : ((step + 1) as OnboardingStep);
}

export function getPreviousOnboardingStep(step: OnboardingStep): OnboardingStep | null {
  return step === 1 ? null : ((step - 1) as OnboardingStep);
}

export function toggleOnboardingSelection(items: string[], item: string): string[] {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

export function shouldRedirectCompletedOnboarding(
  hasCompletedOnboarding: boolean,
  isPreview: boolean,
): boolean {
  return hasCompletedOnboarding && !isPreview;
}
