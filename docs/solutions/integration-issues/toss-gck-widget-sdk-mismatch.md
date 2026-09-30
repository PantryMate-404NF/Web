---
title: 토스 결제창형 클라이언트 키와 SDK 호출 방식 불일치
date: 2026-09-30
category: integration-issues
module: 토스페이먼츠 주문 결제
problem_type: integration_issue
component: payments
symptoms:
  - test_gck 클라이언트 키를 사용하는데 기존 결제창 API를 호출해 SDK 방식과 키 유형이 맞지 않는다
  - 토스 결제창이 연동 가이드와 다르게 표시되거나 앱 전환 흐름에서 진행되지 않는다
root_cause: wrong_api
resolution_type: code_fix
severity: medium
tags: [payments, toss, gck, widgets-sdk]
---

# 토스 결제창형 클라이언트 키와 SDK 호출 방식 불일치

## Problem

토스 결제창형 가이드 기준인 `test_gck` 키를 설정했지만 프론트는 API 개별 연동 키용 `payment.requestPayment()`를 호출해 결제창 UI와 키 유형이 일치하지 않았다.

## Symptoms

- 가이드에서 기대한 결제수단 선택 결제창이 나타나지 않는다.
- `test_gck` 키와 기존 SDK 호출 조합에서 키 유형 불일치가 발생할 수 있다.
- 카드사 앱 전환까지는 되더라도 이 불일치와 카드사 앱 인증 실패는 별개의 문제다.

## What Didn't Work

- 환경변수의 클라이언트 키만 `test_gck`로 교체하는 것만으로는 충분하지 않다. 호출부가 계속 `sdk.payment()`을 사용하면 결제창형 SDK와 맞지 않는다.
- 이 변경은 카드사 앱 인증을 건너뛰지 않는다. 기기에 카드사 앱이 없으면 해당 앱 인증 흐름은 완료할 수 없다.

## Solution

결제창형 연동에는 주문서형·결제창형 키와 `widgets` SDK를 함께 사용한다. 현재 구현은 `sdk.widgets({ customerKey: ANONYMOUS })`로 초기화하고 금액 설정 후 결제창을 렌더링한다. 결제창의 `paymentRequest` 이벤트에서 성공·실패 URL과 함께 결제를 요청한다 (`src/features/payment/lib/request-toss-payment.ts:34-109`).

```ts
const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
await widgets.setAmount({ currency: 'KRW', value: order.totalAmount });
const paymentWindow = await widgets.renderPaymentWindow();

paymentWindow.on('paymentRequest', async () => {
  await widgets.requestPayment({
    orderId: order.orderId,
    orderName: order.name,
    successUrl: `${paymentOrigin}/payment/success`,
    failUrl: `${paymentOrigin}/payment/fail`,
    windowTarget: 'self',
  });
});
```

인증 성공 시 `/payment/success`가 받은 `paymentKey`, `orderId`, `amount`로 백엔드 승인 API를 호출한다. 승인 성공 응답을 받은 뒤에만 완료 화면을 표시한다 (`src/views/payment/ui/payment-success-page.tsx:40-62`). 프론트 클라이언트 키와 백엔드 시크릿 키도 동일한 결제 연동 키 세트로 맞춘다.

## Why This Works

토스의 주문서형·결제창형 연동은 `widgets()` API와 이에 대응하는 `gck` 클라이언트 키 계열을 사용한다. 반면 기존 `payment.requestPayment()` 호출은 다른 SDK 제품/키 계열에 속한다. 키 환경변수만 바꾸는 대신 SDK 호출을 결제창형 흐름에 맞춰야 결제수단 선택 UI, 금액 설정, 인증 리다이렉트가 같은 연동 계약을 따른다.

## Prevention

- 토스 연동을 시작할 때 먼저 제품 유형(주문서형·결제창형·구버전 결제창)을 고르고, 클라이언트·시크릿 키 세트와 프론트 SDK 초기화 방식을 함께 확인한다.
- 회귀 테스트에서 결제창형 흐름의 `setAmount` → `renderPaymentWindow` → `paymentRequest` → `requestPayment` 순서를 검증한다 (`src/features/payment/lib/request-toss-payment.test.ts`).
- 카드사 앱 핸드오프와 백엔드 승인 완료는 별도 단계로 확인한다. 테스트 키는 실제 금액을 청구하지 않지만 앱 기반 카드 인증이 필요한 결제수단은 기기에서 해당 인증을 마쳐야 성공 URL로 돌아온다.
