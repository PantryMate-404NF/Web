import { afterEach, describe, expect, it, vi } from 'vitest';

import { openKakaoPostcode, toPostcodeSelection } from './kakao-postcode';

describe('toPostcodeSelection', () => {
  it('도로명 주소를 선택하면 우편번호와 도로명 주소를 반환한다', () => {
    expect(
      toPostcodeSelection({
        zonecode: '13485',
        userSelectedType: 'R',
        roadAddress: '경기도 성남시 분당구 불정로 90',
        jibunAddress: '경기도 성남시 분당구 정자동 178-1',
      }),
    ).toEqual({ postalCode: '13485', address: '경기도 성남시 분당구 불정로 90' });
  });

  it('지번 주소를 선택하면 지번 주소를 반환한다', () => {
    expect(
      toPostcodeSelection({
        zonecode: '13485',
        userSelectedType: 'J',
        roadAddress: '경기도 성남시 분당구 불정로 90',
        jibunAddress: '경기도 성남시 분당구 정자동 178-1',
      }),
    ).toEqual({ postalCode: '13485', address: '경기도 성남시 분당구 정자동 178-1' });
  });

  it('검색 결과를 선택하면 변환된 주소를 전달하고 팝업을 연다', () => {
    const open = vi.fn();
    const onSelect = vi.fn();
    const Postcode = vi.fn(function (this: { open: () => void }, options) {
      this.open = open;
      options.oncomplete({
        zonecode: '13485',
        userSelectedType: 'R',
        roadAddress: '경기도 성남시 분당구 불정로 90',
        jibunAddress: '',
      });
    });
    vi.stubGlobal('window', { kakao: { Postcode } });

    openKakaoPostcode({ onClose: vi.fn(), onSelect });

    expect(open).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith({
      postalCode: '13485',
      address: '경기도 성남시 분당구 불정로 90',
    });
  });

  it('스크립트가 준비되지 않으면 명확한 오류를 반환한다', () => {
    vi.stubGlobal('window', {});

    expect(() => openKakaoPostcode({ onClose: vi.fn(), onSelect: vi.fn() })).toThrow(
      '우편번호 검색 서비스를 불러오지 못했습니다.',
    );
  });

  afterEach(() => vi.unstubAllGlobals());
});
