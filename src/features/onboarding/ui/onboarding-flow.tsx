'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import {
  canAdvanceOnboardingStep,
  getNextOnboardingStep,
  getPreviousOnboardingStep,
  initialOnboardingAnswers,
  NO_ALLERGY_OPTION,
  normalizeOnboardingCompletionValue,
  ONBOARDING_COMPLETION_VALUE,
  shouldRedirectCompletedOnboarding,
  type OnboardingAnswers,
  type OnboardingStep,
  type TastePreference,
  toggleAllergySelection,
  toggleOnboardingSelection,
} from '../model/onboarding-flow';

const ONBOARDING_STORAGE_KEY = 'pantrymate:onboarding';

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
    ratingGapClassName: 'gap-[46px]',
    scaleSrc: '/images/onboarding/taste-salty-scale.svg',
  },
  {
    name: '단맛',
    ratingGapClassName: 'gap-[46px]',
    scaleSrc: '/images/onboarding/taste-sweet-scale.svg',
  },
  {
    name: '매운맛',
    ratingGapClassName: 'gap-8',
    scaleSrc: '/images/onboarding/taste-spicy-scale.svg',
  },
] as const;

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
  ratingGapClassName,
  scaleSrc,
  value,
  onChange,
}: {
  name: TastePreference;
  ratingGapClassName: string;
  scaleSrc: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <fieldset className={`flex items-center ${ratingGapClassName}`}>
        <legend className="text-title-4 shrink-0 font-semibold">{name}</legend>
        <div className="flex gap-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label className="cursor-pointer" key={rating}>
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
      </fieldset>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-gnb shrink-0">선호하지 않아요</span>
        <Image alt="" height={19} src={scaleSrc} width={212} />
        <span className="text-gnb shrink-0">선호해요</span>
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialOnboardingAnswers);
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const storedCompletionValue = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const completionValue = normalizeOnboardingCompletionValue(storedCompletionValue);

    if (completionValue && completionValue !== storedCompletionValue) {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, completionValue);
    }

    if (shouldRedirectCompletedOnboarding(Boolean(completionValue), isPreview)) {
      router.replace('/?state=complete');
    }
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

  function handleNext() {
    if (!canAdvanceOnboardingStep(step, answers)) return;

    const nextStep = getNextOnboardingStep(step);

    if (nextStep) {
      setStep(nextStep);
      return;
    }

    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, ONBOARDING_COMPLETION_VALUE);
    router.replace('/?state=complete');
  }

  function handleSkip() {
    const nextStep = getNextOnboardingStep(step);

    if (nextStep) setStep(nextStep);
  }

  const canAdvance = canAdvanceOnboardingStep(step, answers);
  const actionLabel = step === 5 ? '완료' : '다음';

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
                ratingGapClassName={taste.ratingGapClassName}
                scaleSrc={taste.scaleSrc}
                value={answers.tastePreferences[taste.name]}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="fixed inset-x-0 bottom-[78px] z-10 mx-auto w-full max-w-[390px] px-4">
        <Button
          className="text-title-3 h-15 w-full rounded-md font-semibold"
          disabled={!canAdvance}
          onClick={handleNext}
          type="button"
        >
          {actionLabel}
        </Button>
      </div>
    </main>
  );
}
