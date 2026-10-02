---
title: 토스 결제 성공 화면에 주문서 실제 데이터 표시
date: 2026-09-30
last_updated: 2026-10-02
category: integration-issues
module: 토스 결제 주문 완료 화면
problem_type: integration_issue
component: payments
symptoms:
  - 결제 승인은 성공해도 완료 화면에 샘플 상품과 주문자 정보가 표시된다
  - 토스 리다이렉트 후 주문서의 상품과 배송지 정보가 화면에서 사라진다
  - 결제한 상품이 결제 완료 후에도 장바구니에 남을 수 있다
root_cause: missing_workflow_step
resolution_type: code_fix
severity: medium
tags: [payments, toss, order-completion, session-storage]
---

# 토스 결제 성공 화면에 주문서 실제 데이터 표시

## Problem

토스 인증 후 성공 URL로 이동하면 주문서 화면의 메모리 상태가 유지되지 않아 결제 완료 화면이 기존 목업 주문 데이터를 표시했다. 주문 생성·승인 API 응답에는 주문 상품과 회원·배송지 정보가 모두 포함되지 않는다.

## Symptoms

- 성공 화면에 실제 결제와 무관한 상품명, 이미지, 주문번호가 나타난다.
- 주문자와 배송지가 결제 당시 주문서 입력값과 다르다.

## What Didn't Work

- 완료 화면에서 기존 주문 내역 목업을 재사용하면 실제 주문 응답에 없는 값까지 사용자에게 보여주게 된다.
- 결제 승인 응답만으로는 상품 목록이나 주문서의 회원·배송지 정보를 복원할 수 없다.

## Solution

주문서가 이미 가진 선택 상품, 프로필, 배송지, 배송 요청사항을 주문 생성 응답의 주문 ID·생성 시각·서버 확정 금액과 결합해 완료 스냅샷을 만든다 (`src/features/payment/model/payment-completion.ts`, `src/features/payment/model/payment-flow.ts`). 이 정보는 토스 화면으로 이동하기 전에 `sessionStorage`에 저장하고, 결제 실패 후 재시도에서도 보존한다 (`src/features/payment/lib/request-toss-payment.ts`, `src/views/payment/ui/payment-fail-page.tsx`). 배송 요청사항이 주문서에서 목업으로 제공되는 동안에는 완료 화면도 주문서에 표시된 값을 이어받는다.

성공 URL에서는 먼저 인증을 복원하고 백엔드 결제 승인을 완료한다. 승인 성공 후 저장된 주문 스냅샷으로 화면을 렌더링하되 최종 결제 금액은 승인 API 응답을 사용한다. 이 스냅샷의 상품은 주문 완료 내역 표시용으로만 사용하며, 결제 성공 흐름에서 상품 상세 조회나 `POST /api/pantry-items`를 호출해 팬트리에 자동 등록하지 않는다. 성공 처리가 끝나면 스냅샷을 제거한다 (`src/views/payment/ui/payment-success-page.tsx`, `src/views/payment/ui/payment-complete-view.tsx`).

장바구니 정리는 승인 응답의 `status`가 `DONE`일 때만 수행한다. 주문 직전 스냅샷에 주문 요청의 `selectedCartItemIds`를 보존하고, 그 ID들에 한해서 `DELETE /carts/items/{cartItemId}`를 호출한다. 이후 장바구니를 다시 조회해 해당 ID가 실제로 빠졌는지 확인한다. 재조회에 실패하거나 ID가 여전히 남아 있으면 결제 성공 상태와 스냅샷을 보존하고, 재시도마다 인증 세션을 복원한 뒤 다시 정리한다. 승인 요청이 실패하거나 응답 상태가 `DONE`이 아니면 삭제하지 않는다 (`src/features/payment/model/payment-redirect.ts`, `src/features/payment/model/cleanup-purchased-cart.ts`, `src/views/payment/ui/payment-success-page.tsx`).

## Why This Works

토스 리다이렉트는 앱 페이지의 메모리 상태를 보장하지 않지만 같은 탭의 `sessionStorage`는 리다이렉트 왕복 동안 유지된다. 따라서 주문서에서 확인한 데이터와 백엔드가 확정한 주문·결제 값을 함께 표시할 수 있다. 성공 URL 도착 자체를 결제 완료로 간주하지 않고 승인 응답의 `DONE`을 확인하므로, 결제가 확정되기 전에 구매 항목을 장바구니에서 삭제하지 않는다.

## Prevention

- 외부 결제나 인증 화면으로 이동하기 전에 돌아온 화면에 필요한 최소 주문 데이터를 같은 탭의 임시 저장소에 기록한다.
- 결제 승인 금액은 브라우저의 예상 합계 대신 승인 API 응답을 표시한다.
- 저장된 완료 정보가 없으면 목업으로 대체하지 말고 주문 상세 정보를 확인할 수 없다고 안내한다.
- 승인 성공 후 임시 결제 데이터를 제거하고 실패 재시도 중에는 유지한다.
- 장바구니에서는 결제 시점에 선택된 ID만 보존하고, 승인 상태 `DONE` 이후에만 해당 ID를 삭제한다. 다시 조회한 결과에 구매 항목이 남아 있으면 스냅샷을 보존해 재시도할 수 있게 한다.
- 장바구니 정리 재시도 전에도 세션을 복원한다. 결제 창 왕복이나 사용자의 대기 중 access token이 만료될 수 있다.
- 주문 완료 스냅샷의 구매 상품은 주문 내역에 남기고 팬트리 등록 API에 전달하지 않는다. 팬트리 등록이 필요하면 사용자가 수동 등록이나 OCR 검토 흐름에서 명시적으로 진행한다.
- 결제 완료 회귀 테스트는 주문 상품 목록이 유지되는 동시에 팬트리 등록 요청이 발생하지 않는지 확인한다 (`src/views/payment/ui/payment-success-page.test.ts`).

## Related Issues

- [토스 결제창형 클라이언트 키와 SDK 호출 방식 불일치](toss-gck-widget-sdk-mismatch.md)
