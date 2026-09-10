import { describe, expect, it } from 'vitest';

import { fromUserPreference, toUserPreferenceUpdateRequest } from './onboarding-preference';

describe('toUserPreferenceUpdateRequest', () => {
  it('온보딩 화면의 한국어 선택값을 USER API 저장 형식으로 변환한다', () => {
    expect(
      toUserPreferenceUpdateRequest(
        {
          allergies: ['우유'],
          favoriteFoods: ['불고기', '김치찌개', '카레라이스'],
          foodTypes: ['한식', '아시안'],
          householdSize: '5인 이상 가구',
          tastePreferences: { 단맛: 4, 매운맛: 2, 짠맛: 5 },
        },
        5,
        true,
      ),
    ).toEqual({
      allergies: ['우유'],
      familyMemberCount: 5,
      favoriteFoods: ['불고기', '김치찌개', '카레라이스'],
      onboardingCompleted: true,
      onboardingStep: 5,
      preferredFoodTypes: ['KOREAN', 'ETC'],
      tastePreferences: { salty: 5, spicy: 2, sweet: 4 },
    });
  });
});

describe('fromUserPreference', () => {
  it('저장된 사용자 설정과 진행 단계를 온보딩 화면 상태로 복원한다', () => {
    expect(
      fromUserPreference({
        allergies: ['우유'],
        familyMemberCount: 2,
        favoriteFoods: ['불고기', '김치찌개', '카레라이스'],
        onboardingCompleted: false,
        onboardingStep: 4,
        preferredFoodTypes: ['KOREAN', 'ETC'],
        tastePreferences: { salty: 5, spicy: 2, sweet: 4 },
      }),
    ).toEqual({
      answers: {
        allergies: ['우유'],
        favoriteFoods: ['불고기', '김치찌개', '카레라이스'],
        foodTypes: ['한식', '아시안'],
        householdSize: '2인 가구',
        tastePreferences: { 단맛: 4, 매운맛: 2, 짠맛: 5 },
      },
      step: 4,
    });
  });

  it('4명으로 저장된 가구 구성원을 4인 가구 선택값으로 복원한다', () => {
    const { answers } = fromUserPreference({
      allergies: [],
      familyMemberCount: 4,
      favoriteFoods: [],
      onboardingCompleted: false,
      onboardingStep: 1,
      preferredFoodTypes: [],
      tastePreferences: null,
    });

    expect(answers.householdSize).toBe('4인 가구');
  });
});
