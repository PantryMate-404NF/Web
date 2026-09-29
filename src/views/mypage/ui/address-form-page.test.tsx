import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

import { AddressFormPage } from './address-form-page';

describe('AddressFormPage', () => {
  it('기존 배송지를 편집할 때 값을 채우고 관리 동작을 제공한다', () => {
    const markup = renderToStaticMarkup(
      createElement(AddressFormPage, {
        initialAddress: {
          id: '12',
          recipientName: '김지웅',
          phoneNumber: '01012345678',
          postalCode: '13485',
          addressLine1: '경기도 성남시 분당구 불정로 90',
          addressLine2: '101동 1001호',
          isDefault: false,
        },
        onSubmit: async () => undefined,
      }),
    );

    expect(markup).toContain('배송지 수정');
    expect(markup).toContain('value="김지웅"');
    expect(markup).toContain('value="13485"');
    expect(markup).not.toContain('배송지 삭제');
    expect(markup).toContain('수정 완료');
  });

  it('피그마의 배송지 필수 입력과 비활성 확인 상태를 표시한다', () => {
    const markup = renderToStaticMarkup(createElement(AddressFormPage));

    expect(markup).toContain('배송지 추가');
    expect(markup).toContain('받으시는 분');
    expect(markup).toContain('휴대폰 번호');
    expect(markup).toContain('우편번호 검색');
    expect(markup).toContain('상세 주소를 입력해주세요.');
    expect(markup).toContain('기본 배송지로 설정');
    expect(markup).toContain('취소');
    expect(markup).toContain('확인');
    expect(markup).toContain('disabled=""');
    expect(markup.match(/required=""/g)).toHaveLength(3);
    expect(markup.match(/aria-required="true"/g)).toHaveLength(2);
  });

  it('피그마 자산과 세로 간격으로 빈 배송지 폼을 구성한다', () => {
    const markup = renderToStaticMarkup(createElement(AddressFormPage));

    expect(markup).toContain('/icons/address/required.svg');
    expect(markup).toContain('/icons/address/check-disabled.svg');
    expect(markup).toContain('mt-[159px]');
    expect(markup).not.toContain('fixed bottom-0');
  });
});
