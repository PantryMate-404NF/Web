'use client';

import Script from 'next/script';

const KAKAO_POSTCODE_SCRIPT_URL =
  'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export function KakaoPostcodeScript({
  onError,
  onReady,
}: {
  onError: () => void;
  onReady: () => void;
}) {
  return (
    <Script
      id="kakao-postcode-script"
      onError={onError}
      onReady={onReady}
      src={KAKAO_POSTCODE_SCRIPT_URL}
      strategy="afterInteractive"
    />
  );
}
