import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => navigationState.searchParams,
}));

import {
  OnboardingFlow,
  TastePreferenceSelector,
  TASTE_SCALE_END_LABEL_CLASS_NAME,
} from './onboarding-flow';

describe('OnboardingFlow', () => {
  beforeEach(() => {
    navigationState.searchParams = new URLSearchParams();
  });

  it('복원 가능한 4인 가구 선택지를 렌더링한다', () => {
    navigationState.searchParams = new URLSearchParams('preview=1');

    expect(renderToStaticMarkup(<OnboardingFlow />)).toContain('4인 가구');
  });

  it('단계 수 대신 온보딩 전체 건너뛰기 버튼을 렌더링한다', () => {
    navigationState.searchParams = new URLSearchParams('preview=1');

    const markup = renderToStaticMarkup(<OnboardingFlow />);

    expect(markup).toContain('>건너뛰기</button>');
    expect(markup).not.toContain('>1/5</span>');
  });

  it('첫 단계의 가구 선택지를 피그마 문구로 렌더링한다', () => {
    navigationState.searchParams = new URLSearchParams('preview=1');

    const markup = renderToStaticMarkup(<OnboardingFlow />);

    expect(markup).toContain('2~3인 가구');
    expect(markup).not.toContain('>2인 가구</label>');
    expect(markup).not.toContain('>3인 가구</label>');
  });

  it('피그마 원본 뒤로가기 아이콘을 렌더링한다', () => {
    navigationState.searchParams = new URLSearchParams('preview=1');

    const markup = renderToStaticMarkup(<OnboardingFlow />);

    expect(markup).toContain('src="/icons/navigation/back.svg"');
  });

  it('온보딩 정보를 불러오는 동안 상태 안내를 렌더링한다', () => {
    const markup = renderToStaticMarkup(<OnboardingFlow />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('온보딩 정보를 불러오는 중입니다.');
  });
});

describe('TastePreferenceSelector', () => {
  it('키보드 포커스 시 평점 선택 위치를 확인할 수 있게 표시한다', () => {
    const markup = renderToStaticMarkup(
      <TastePreferenceSelector name="짠맛" onChange={vi.fn()} scaleSrc="/taste.svg" value={3} />,
    );

    expect(markup).toContain('peer-focus-visible:ring-2');
  });

  it('선택된 표정을 어둡게 만드는 multiply 효과를 사용하지 않는다', () => {
    const markup = renderToStaticMarkup(
      <TastePreferenceSelector name="짠맛" onChange={vi.fn()} scaleSrc="/taste.svg" value={3} />,
    );

    expect(markup).toContain('mix-blend-color');
    expect(markup).not.toContain('mix-blend-multiply');
    expect(markup).not.toContain('opacity-80');
  });
});

describe('TASTE_SCALE_END_LABEL_CLASS_NAME', () => {
  it('keeps an 8px gap between the expression scale and its end label', () => {
    expect(TASTE_SCALE_END_LABEL_CLASS_NAME).toContain('pl-2');
  });
});
