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
    expect(markup).toContain('하인즈 토마토 케찹(342g)');
    expect(markup).toContain('GAP 알찬 완숙토마토 450g(3입)');
    expect(markup).toContain('완전방사 무항생제 유정란(10구)');
    expect(markup).toContain('배송 상세');
    expect(markup).toContain('배송 현황');
  });

  it('이전 화면으로 돌아갈 수 있는 버튼을 제공한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('aria-label="이전 화면"');
    expect(markup).toContain('href="/mypage/orders"');
  });

  it('구매 상품과 배송 상세 사이에 Grey-100 배경색의 8px 구분선을 표시한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);
    const purchaseProducts = markup.match(
      /<section[^>]*aria-labelledby="purchase-product-title">([\s\S]*?)<\/section>/,
    )?.[0];

    expect(purchaseProducts).not.toContain('border-b-8');
    expect(markup).toContain(
      '<div aria-hidden="true" class="h-2 w-full bg-[var(--primitive-grey-100)]"></div>',
    );
  });

  it('배송 상세 라벨과 값에 지정한 색상과 타이포그래피를 적용한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain(
      'class="text-text-tertiary font-[&#x27;Pretendard&#x27;] text-base leading-6"',
    );
    expect(markup).toContain(
      'class="text-text-secondary relative font-[&#x27;Pretendard&#x27;] text-base leading-6"',
    );
    expect(markup).not.toContain('font-black');
    expect(markup).toContain('배송일자');
    expect(markup).toContain('2026.09.30');
    expect(markup).toContain('CJ대한통운');
    expect(markup).toContain('441481641546');
    expect(markup).toContain('한바쁨');
  });

  it('운송장 번호와 복사 아이콘을 같은 중심선에 일정한 간격으로 배치한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('aria-label="운송장번호 복사"');
    expect(markup).toContain('class="h-auto w-4 shrink-0"');
    expect(markup).toContain('font-[&#x27;Pretendard&#x27;] text-base leading-6');
    expect(markup).toContain('left-full');
    expect(markup).toContain('ml-1');
    expect(markup).not.toContain('left-[103px]');
  });

  it('배송 상세 영역은 제목과 세부 정보 사이에만 얇은 구분선을 표시한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);
    const deliveryDetails = markup.match(
      /<section[^>]*aria-labelledby="delivery-detail-title">([\s\S]*?)<\/section>/,
    )?.[0];

    expect(deliveryDetails).toContain('border-b px-3');
    expect(deliveryDetails).not.toContain('border-b-8');
  });

  it('배송 상세와 배송 현황 사이에 Figma 기준 8px 간격을 둔다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('<section class="pt-2" aria-labelledby="delivery-history-title">');
  });

  it('배송 이력 아래에는 하단 네비게이션을 표시하지 않는다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).not.toContain('aria-label="주요 메뉴"');
  });
});
