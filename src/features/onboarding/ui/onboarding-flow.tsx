'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getMyPreferences } from '@/entities/user/api/get-my-preferences';
import { updateMyPreferences } from '@/entities/user/api/update-my-preferences';
import { ApiError } from '@/shared/api/api-error';

import {
  canAdvanceOnboardingStep,
  getNextOnboardingStep,
  getPreviousOnboardingStep,
  getTasteScaleGridClassName,
  getTasteSelectionPosition,
  initialOnboardingAnswers,
  NO_ALLERGY_OPTION,
  type OnboardingAnswers,
  type OnboardingStep,
  type TastePreference,
  toggleAllergySelection,
  toggleOnboardingSelection,
} from '../model/onboarding-flow';
import { fromUserPreference, toUserPreferenceUpdateRequest } from '../model/onboarding-preference';

const householdOptions = ['1인 가구', '2인 가구', '3인 가구', '5인 이상 가구'];

const allergyOptions = [
  '알류(가금류)',
  '우유',
  '메밀',
  '땅콩',
  '대두',
  '밀',
  '고등어',
  '게',
  '새우',
  '돼지고기',
  '복숭아',
  '토마토',
  '호두',
  '아황산류',
  '닭고기',
  '쇠고기',
  '오징어',
  '조개류(굴,전복,홍합 포함)',
  '잣',
];

const foodTypeOptions = [
  {
    cardClassName: 'pt-1',
    imageClassName: '-mb-3.5 size-[72px]',
    imageHeight: 72,
    imageSrc: '/images/onboarding/korean-food.png',
    imageWidth: 72,
    label: '한식',
  },
  {
    cardClassName: 'pt-1.5',
    imageClassName: '-mb-2 size-[64px]',
    imageHeight: 64,
    imageSrc: '/images/onboarding/chinese-food.png',
    imageWidth: 62,
    label: '중식',
  },
  {
    cardClassName: 'pt-1',
    imageClassName: '-mb-3.5 size-[72px]',
    imageHeight: 72,
    imageSrc: '/images/onboarding/japanese-food.png',
    imageWidth: 72,
    label: '일식',
  },
  {
    cardClassName: 'pt-1',
    imageClassName: '-mb-4 h-[74px] w-[74px]',
    imageHeight: 74,
    imageSrc: '/images/onboarding/western-food.png',
    imageWidth: 74,
    label: '양식',
  },
  {
    cardClassName: 'pt-0',
    imageClassName: '-mb-2.5 size-[72px]',
    imageHeight: 72,
    imageSrc: '/images/onboarding/asian-food.png',
    imageWidth: 72,
    label: '아시안',
  },
];

const favoriteFoodOptions = [
  '오징어볶음',
  '오징어초무침',
  '불고기',
  '김치찌개',
  '된장찌개',
  '계란말이',
  '해물파전',
  '크림파스타',
  '스테이크',
  '팬케이크',
  '카프레제',
  '깐풍기',
  '탕수육',
  '짬뽕',
  '연어덮밥',
  '유부초밥',
  '돈까스',
  '쌀국수',
  '후라이드치킨',
  '카레라이스',
];

const tastePreferences = [
  {
    name: '짠맛',
    scaleSrc: '/images/onboarding/taste-salty-scale.svg',
  },
  {
    name: '단맛',
    scaleSrc: '/images/onboarding/taste-sweet-scale.svg',
  },
  {
    name: '매운맛',
    scaleSrc: '/images/onboarding/taste-spicy-scale.svg',
  },
] as const;

/** 표정 척도와 오른쪽 끝 라벨 사이의 8px 여백을 유지합니다. */
export const TASTE_SCALE_END_LABEL_CLASS_NAME = 'text-gnb whitespace-nowrap pl-2';

function SelectionChip({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="has-checked:border-primary text-title-4 flex h-10 cursor-pointer items-center justify-center rounded-full border px-5 font-medium transition-colors has-checked:bg-[var(--primitive-primary-300)]">
      <input checked={checked} className="sr-only" onChange={onChange} type="checkbox" />
      {label}
    </label>
  );
}

function OnboardingHeader({
  onBack,
  onSkip,
  step,
}: {
  onBack: () => void;
  onSkip: () => void;
  step: OnboardingStep;
}) {
  const isSkippable = step === 3 || step === 4;

  return (
    <header className="flex h-16 items-center gap-4 px-4">
      <button
        aria-label="이전 단계"
        className="focus-visible:ring-ring grid size-10 shrink-0 place-items-center rounded-full focus-visible:ring-2"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft aria-hidden="true" className="size-6" />
      </button>
      <div className="flex items-center gap-8">
        <div
          aria-label={`온보딩 ${step}단계, 총 5단계`}
          aria-valuemax={5}
          aria-valuemin={1}
          aria-valuenow={step}
          className="bg-border h-4 w-[min(215px,calc(100vw-174px))] overflow-hidden rounded-full"
          role="progressbar"
        >
          <div className="bg-primary h-full rounded-full" style={{ width: `${step * 20}%` }} />
        </div>
        {isSkippable ? (
          <button
            className="text-title-4 focus-visible:outline-ring shrink-0 font-medium focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={onSkip}
            type="button"
          >
            건너뛰기
          </button>
        ) : (
          <span className="text-title-4 shrink-0 font-medium">{step}/5</span>
        )}
      </div>
    </header>
  );
}

function StepTitle({
  children,
  helper,
  titleLeading = 'leading-[1.4]',
  titleWidth = 'max-w-[238px]',
}: {
  children: React.ReactNode;
  helper?: string;
  titleLeading?: string;
  titleWidth?: string;
}) {
  return (
    <div className="px-7 pt-2">
      <h1 className={`text-heading-1 ${titleWidth} ${titleLeading} font-semibold`}>{children}</h1>
      {helper ? (
        <p className="text-body-3 mt-1 leading-6 font-medium text-[var(--primitive-primary-700)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function TastePreferenceSelector({
  name,
  scaleSrc,
  value,
  onChange,
}: {
  name: TastePreference;
  scaleSrc: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const tasteScaleGridClassName = getTasteScaleGridClassName();

  return (
    <div>
      <fieldset>
        <legend className="sr-only">{name}</legend>
        <div className={`grid ${tasteScaleGridClassName} items-center`}>
          <span aria-hidden="true" className="text-title-4 font-semibold">
            {name}
          </span>
          <div className="relative h-6 min-w-0">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label
                className="absolute top-0 grid size-6 -translate-x-1/2 cursor-pointer place-items-center"
                key={rating}
                style={{ left: getTasteSelectionPosition(rating) }}
              >
                <input
                  checked={value === rating}
                  className="sr-only"
                  name={name}
                  onChange={() => onChange(rating)}
                  type="radio"
                  value={rating}
                />
                <Image
                  alt={`${rating}점`}
                  className="size-6"
                  height={24}
                  src={
                    value === rating
                      ? '/images/onboarding/taste-selected.svg'
                      : '/images/onboarding/taste-unselected.svg'
                  }
                  width={24}
                />
              </label>
            ))}
          </div>
        </div>
      </fieldset>
      <div className={`mt-2 grid ${tasteScaleGridClassName} items-center`}>
        <span className="text-gnb whitespace-nowrap">선호하지 않아요</span>
        <div className="relative aspect-[212/19] min-w-0" aria-hidden="true">
          <Image
            alt=""
            className="h-auto w-full grayscale"
            height={19}
            src={scaleSrc}
            width={212}
          />
          <span
            className="pointer-events-none absolute top-0 z-10 size-[19px] -translate-x-1/2 rounded-full bg-[var(--primitive-primary-400)] opacity-80 mix-blend-multiply"
            style={{ left: getTasteSelectionPosition(value) }}
          />
        </div>
        <span className={TASTE_SCALE_END_LABEL_CLASS_NAME}>선호해요</span>
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const [step, setStep] = useState<OnboardingStep>(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialOnboardingAnswers);
  const [isLoading, setIsLoading] = useState(!isPreview);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (isPreview) {
      return;
    }

    async function restoreOnboarding() {
      try {
        const preference = await getMyPreferences();

        if (preference.onboardingCompleted) {
          router.replace('/?state=complete');
          return;
        }

        const restored = fromUserPreference(preference);
        setAnswers(restored.answers);
        setStep(restored.step);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          router.replace('/login');
          return;
        }

        setSaveError('온보딩 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    }

    void restoreOnboarding();
  }, [isPreview, router]);

  function toggleAnswer(key: 'allergies' | 'foodTypes' | 'favoriteFoods', value: string) {
    setAnswers((current) => ({
      ...current,
      [key]:
        key === 'allergies'
          ? toggleAllergySelection(current.allergies, value)
          : toggleOnboardingSelection(current[key], value),
    }));
  }

  function handleBack() {
    const previousStep = getPreviousOnboardingStep(step);

    if (previousStep) {
      setStep(previousStep);
      return;
    }

    router.push('/');
  }

  async function saveOnboarding(onboardingStep: OnboardingStep, onboardingCompleted: boolean) {
    if (isPreview) return true;

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateMyPreferences(
        toUserPreferenceUpdateRequest(answers, onboardingStep, onboardingCompleted),
      );
      return true;
    } catch {
      setSaveError('온보딩 정보를 저장하지 못했습니다. 다시 시도해 주세요.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleNext() {
    if (!canAdvanceOnboardingStep(step, answers)) return;

    const nextStep = getNextOnboardingStep(step);

    if (nextStep) {
      if (!(await saveOnboarding(nextStep, false))) return;
      setStep(nextStep);
      return;
    }

    if (!(await saveOnboarding(step, true))) return;
    router.replace('/?state=complete');
  }

  async function handleSkip() {
    const nextStep = getNextOnboardingStep(step);

    if (nextStep && (await saveOnboarding(nextStep, false))) setStep(nextStep);
  }

  const canAdvance = canAdvanceOnboardingStep(step, answers);
  const actionLabel = step === 5 ? '완료' : '다음';

  if (isLoading) {
    return <main className="mobile-page bg-background min-h-dvh" />;
  }

  return (
    <main className="mobile-page bg-background min-h-dvh pt-[env(safe-area-inset-top)] pb-24">
      <OnboardingHeader onBack={handleBack} onSkip={handleSkip} step={step} />

      {step === 1 ? (
        <>
          <StepTitle titleLeading="leading-9" titleWidth="w-[215px]">
            함께 식사하는 가족은
            <br />몇 명인가요?
          </StepTitle>
          <fieldset className="mt-[88px] grid grid-cols-2 gap-3 px-7">
            <legend className="sr-only">가구 구성원 수</legend>
            {householdOptions.map((option) => (
              <label
                className="has-checked:border-primary text-title-2 text-disabled has-checked:text-foreground flex h-[107px] cursor-pointer items-center justify-center rounded-md border font-semibold transition-colors has-checked:bg-[var(--primitive-primary-300)]"
                key={option}
              >
                <input
                  checked={answers.householdSize === option}
                  className="sr-only"
                  name="household-size"
                  onChange={() => setAnswers((current) => ({ ...current, householdSize: option }))}
                  type="radio"
                  value={option}
                />
                {option}
              </label>
            ))}
          </fieldset>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <StepTitle helper="여러 개 선택할 수 있어요.">
            알레르기가 있는 식품을
            <br />
            선택해 주세요.
          </StepTitle>
          <fieldset className="mt-10 px-7">
            <legend className="text-title-4 font-semibold">알레르기 종류</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <SelectionChip
                checked={answers.allergies.includes(NO_ALLERGY_OPTION)}
                label={NO_ALLERGY_OPTION}
                onChange={() => toggleAnswer('allergies', NO_ALLERGY_OPTION)}
              />
              {allergyOptions.map((option) => (
                <SelectionChip
                  checked={answers.allergies.includes(option)}
                  key={option}
                  label={option}
                  onChange={() => toggleAnswer('allergies', option)}
                />
              ))}
            </div>
          </fieldset>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <StepTitle helper="여러 개 선택할 수 있어요.">선호하는 음식 유형을 골라주세요.</StepTitle>
          <fieldset className="mt-15 grid grid-cols-2 gap-3 px-7">
            <legend className="sr-only">선호 음식 유형</legend>
            {foodTypeOptions.map((option) => (
              <label
                className={`has-checked:border-primary text-title-2 text-disabled has-checked:text-foreground flex h-[107px] cursor-pointer flex-col items-center justify-start rounded-md border font-semibold transition-colors has-checked:bg-[var(--primitive-primary-300)] ${option.cardClassName}`}
                key={option.label}
              >
                <input
                  checked={answers.foodTypes.includes(option.label)}
                  className="sr-only"
                  onChange={() => toggleAnswer('foodTypes', option.label)}
                  type="checkbox"
                />
                <Image
                  alt=""
                  className={`${option.imageClassName} object-contain`}
                  height={option.imageHeight}
                  src={option.imageSrc}
                  width={option.imageWidth}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        </>
      ) : null}

      {step === 4 ? (
        <>
          <StepTitle helper="최소 3개 선택" titleWidth="max-w-[262px]">
            좋아하는 음식을 3개 이상 선택해 주세요.
          </StepTitle>
          <fieldset className="mt-10 px-7">
            <legend className="text-title-4 font-semibold">음식 종류</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {favoriteFoodOptions.map((option) => (
                <SelectionChip
                  checked={answers.favoriteFoods.includes(option)}
                  key={option}
                  label={option}
                  onChange={() => toggleAnswer('favoriteFoods', option)}
                />
              ))}
            </div>
          </fieldset>
        </>
      ) : null}

      {step === 5 ? (
        <>
          <StepTitle titleWidth="w-[241px]">선호하는 맛의 정도를 선택해 주세요.</StepTitle>
          <div className="mt-14 space-y-12 px-7">
            {tastePreferences.map((taste) => (
              <TastePreferenceSelector
                key={taste.name}
                name={taste.name}
                onChange={(value) =>
                  setAnswers((current) => ({
                    ...current,
                    tastePreferences: { ...current.tastePreferences, [taste.name]: value },
                  }))
                }
                scaleSrc={taste.scaleSrc}
                value={answers.tastePreferences[taste.name]}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="fixed inset-x-0 bottom-[78px] z-10 mx-auto w-full max-w-[390px] px-4">
        {saveError ? (
          <p className="text-body-4 text-destructive mb-2 text-center" role="alert">
            {saveError}
          </p>
        ) : null}
        <Button
          className="text-title-3 h-15 w-full rounded-md font-semibold"
          disabled={!canAdvance || isSaving}
          onClick={handleNext}
          type="button"
        >
          {isSaving ? '저장 중...' : actionLabel}
        </Button>
      </div>
    </main>
  );
}
