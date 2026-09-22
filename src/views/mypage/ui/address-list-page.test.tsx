import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AddressListPage } from './address-list-page';

describe('AddressListPage', () => {
  it('기본 배송지 정보와 관리 진입점을 표시한다', () => {
    const markup = renderToStaticMarkup(createElement(AddressListPage));

    expect(markup).toContain('배송지 목록');
    expect(markup).toContain('집밥사랑');
    expect(markup).toContain('기본배송지');
    expect(markup).toContain('010-1234-2222');
    expect(markup).toContain('배송지 수정');
    expect(markup).toContain('배송지 추가');
    expect(markup).toContain('w-[358px]');
  });

  it('등록된 배송지 카드와 추가 버튼을 피그마 규격으로 배치한다', () => {
    const markup = renderToStaticMarkup(
      createElement(AddressListPage, {
        addresses: [
          {
            id: 'home',
            recipientName: '집밥사랑',
            phoneNumber: '010-1234-2222',
            addressLine1: '서울특별시 신선하구 맛있동 425',
            addressLine2: '행복빌라, 101호',
            postalCode: '13485',
            isDefault: true,
          },
        ],
      }),
    );

    expect(markup).toContain('h-[137px]');
    expect(markup).not.toContain('min-h-[137px]');
    expect(markup).toContain('gap-5 pt-3');
    expect(markup).toContain('h-[60px]');
    expect(markup).toContain('서울특별시 신선하구 맛있동 425 행복빌라, 101호 (13485)');
  });

  it('등록된 배송지가 없으면 목록 전용 빈 상태를 표시한다', () => {
    const markup = renderToStaticMarkup(createElement(AddressListPage, { addresses: [] }));

    expect(markup).toContain('등록된 배송지가 없어요');
    expect(markup).toContain('배송지 추가');
    expect(markup).toContain('src="/icons/address/empty.svg"');
    expect(markup).toContain('h-[578px]');
    expect(markup).toContain('size-[54.25px]');
    expect(markup).toContain('text-body-3');
  });

  it('주문서에서 진입하면 추가 화면과 주문서 복귀 주소를 연결한다', () => {
    const markup = renderToStaticMarkup(
      createElement(AddressListPage, {
        addresses: [],
        returnTo: '/order?preview=1&items=onion',
      }),
    );

    expect(markup).toContain(
      'href="/mypage/addresses/new?returnTo=%2Forder%3Fpreview%3D1%26items%3Donion"',
    );
    expect(markup).toContain('href="/order?preview=1&amp;items=onion"');
  });
});
