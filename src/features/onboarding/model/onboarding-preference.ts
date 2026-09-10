/** 온보딩 화면 값과 USER API 선호 설정 DTO를 상호 변환합니다. */

import type {
  PreferredFoodType,
  UserPreference,
  UserPreferenceUpdateRequest,
} from '@/entities/user/api/user-preference.dto';

import {
  initialOnboardingAnswers,
  NO_ALLERGY_OPTION,
  type OnboardingAnswers,
  type OnboardingStep,
} from './onboarding-flow';

const foodTypeToApi: Record<string, PreferredFoodType> = {
  한식: 'KOREAN',
  양식: 'WESTERN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  아시안: 'ETC',
};

const apiToFoodType: Record<PreferredFoodType, string> = {
  CHINESE: '중식',
  ETC: '아시안',
  JAPANESE: '일식',
  KOREAN: '한식',
  WESTERN: '양식',
};

function toHouseholdSize(familyMemberCount: number): string {
  return familyMemberCount >= 5 ? '5인 이상 가구' : `${familyMemberCount}인 가구`;
}

function toFamilyMemberCount(householdSize: string | null): number {
  if (!householdSize) {
    throw new Error('가족 구성원 수를 선택해야 합니다.');
  }

  return householdSize === '5인 이상 가구' ? 5 : Number.parseInt(householdSize, 10);
}

function toOnboardingStep(step: number): OnboardingStep {
  return Math.min(Math.max(step, 1), 5) as OnboardingStep;
}

export function toUserPreferenceUpdateRequest(
  answers: OnboardingAnswers,
  onboardingStep: number,
  onboardingCompleted: boolean,
): UserPreferenceUpdateRequest {
  return {
    allergies: answers.allergies.filter((allergy) => allergy !== NO_ALLERGY_OPTION),
    familyMemberCount: toFamilyMemberCount(answers.householdSize),
    favoriteFoods: answers.favoriteFoods,
    onboardingCompleted,
    onboardingStep,
    preferredFoodTypes: answers.foodTypes.map((foodType) => foodTypeToApi[foodType]),
    tastePreferences:
      onboardingStep < 5
        ? null
        : {
            salty: answers.tastePreferences.짠맛,
            spicy: answers.tastePreferences.매운맛,
            sweet: answers.tastePreferences.단맛,
          },
  };
}

export function fromUserPreference(
  preference: Pick<
    UserPreference,
    | 'allergies'
    | 'familyMemberCount'
    | 'favoriteFoods'
    | 'onboardingCompleted'
    | 'onboardingStep'
    | 'preferredFoodTypes'
    | 'tastePreferences'
  >,
) {
  const step = toOnboardingStep(preference.onboardingStep);
  const savedAllergies = preference.allergies ?? [];

  return {
    answers: {
      ...initialOnboardingAnswers,
      allergies: savedAllergies.length === 0 && step > 2 ? [NO_ALLERGY_OPTION] : savedAllergies,
      favoriteFoods: preference.favoriteFoods ?? [],
      foodTypes: (preference.preferredFoodTypes ?? []).map((foodType) => apiToFoodType[foodType]),
      householdSize: toHouseholdSize(preference.familyMemberCount),
      tastePreferences: preference.tastePreferences
        ? {
            단맛: preference.tastePreferences.sweet,
            매운맛: preference.tastePreferences.spicy,
            짠맛: preference.tastePreferences.salty,
          }
        : initialOnboardingAnswers.tastePreferences,
    },
    step,
  };
}
