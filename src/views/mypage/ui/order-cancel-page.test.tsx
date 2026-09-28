import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import {
  getAgreementCheckClassName,
  getCancellationReasonBorderColor,
  getCancellationReasonRadioClasses,
  OrderCancelPage,
} from './order-cancel-page';

describe('OrderCancelPage', () => {
  it('취소 사유와 환불 정보, 초기 비활성 주문 취소 버튼을 표시한다', () => {
    const markup = renderToStaticMarkup(<OrderCancelPage orderId="20260901" />);

    expect(markup).toContain('취소 사유 선택');
    expect(markup).toContain('단순 변심');
    expect(markup).toContain('환불 예정 금액');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('h-2 w-full bg-[var(--primitive-grey-100)]');
    expect(markup).not.toContain('border-t-8');
    expect(markup).toContain('size-[22px]');
    expect(markup).toContain('rounded-full');
  });

  it('선택한 취소 사유에는 primitive primary-500 테두리를 적용한다', () => {
    expect(getCancellationReasonBorderColor(true)).toBe('var(--primitive-primary-500)');
    expect(getCancellationReasonBorderColor(false)).toBe('var(--border-default)');
  });

  it('선택된 취소 사유 라디오는 노란색 바깥 원과 흰색 가운데 원을 표시한다', () => {
    expect(getCancellationReasonRadioClasses(true)).toEqual({
      outer: 'bg-primary',
      inner: 'bg-background',
    });
    expect(getCancellationReasonRadioClasses(false)).toEqual({
      outer: 'border border-border',
      inner: '',
    });
  });

  it('동의 체크는 기본 회색, 선택 시 primitive primary-500 배경을 적용한다', () => {
    expect(getAgreementCheckClassName(false)).toContain('bg-surface-disabled');
    expect(getAgreementCheckClassName(true)).toContain('bg-[var(--primitive-primary-500)]');
  });
});
