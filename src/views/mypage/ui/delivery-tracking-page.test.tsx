import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DeliveryTrackingPage } from './delivery-tracking-page';

describe('DeliveryTrackingPage', () => {
  it('배송 완료 상태의 구매 상품과 배송 상세 정보를 표시한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('배송 준비');
    expect(markup).toContain('배송 중');
    expect(markup).toContain('배송 완료');
    expect(markup).toContain('구매 상품');
    expect(markup).toContain('배송 상세');
    expect(markup).toContain('배송 현황');
  });

  it('이전 화면으로 돌아갈 수 있는 버튼을 제공한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('aria-label="이전 화면"');
  });

  it('운송장 번호와 복사 아이콘을 같은 중심선에 일정한 간격으로 배치한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('aria-label="운송장번호 복사"');
    expect(markup).toContain('text-base leading-6');
    expect(markup).toContain('left-full');
    expect(markup).toContain('ml-2');
    expect(markup).not.toContain('left-[103px]');
  });

  it('배송 이력 아래에는 하단 네비게이션을 표시하지 않는다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).not.toContain('aria-label="주요 메뉴"');
  });
});
