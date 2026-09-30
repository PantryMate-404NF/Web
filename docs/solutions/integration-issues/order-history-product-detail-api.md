---
title: 주문 내역 목록과 상세를 실제 주문 API에 연결
date: 2026-09-30
category: integration-issues
module: 마이페이지 주문 내역
problem_type: integration_issue
component: payments
symptoms:
  - 주문 목록과 상세 화면에 샘플 주문과 상품이 표시된다
  - 새로 결제한 실제 주문이 주문 내역에서 보이지 않는다
root_cause: missing_workflow_step
resolution_type: code_fix
severity: medium
tags: [orders, order-history, api-integration]
---

# 주문 내역 목록과 상세를 실제 주문 API에 연결

## Problem

`/mypage/orders`와 주문 상세 화면이 고정 목업 주문을 렌더링해 사용자가 최근 결제한 실제 상품을 확인할 수 없었다. 주문 목록 응답에는 상품별 정보가 없고 주문 상세 응답에서 주문 항목을 조회해야 한다.

## Symptoms

- 주문 목록이 실제 주문 번호·상품명·가격·수량 대신 샘플 값을 보여준다.
- 목록을 실제 주문 ID로 바꾸면 기존 상세 라우트가 목업 ID가 아니라는 이유로 목록으로 돌려보낸다.

## What Didn't Work

- `GET /orders`의 `representativeProductName`만으로는 목록의 상품별 이름·가격·수량을 만들 수 없다.
- 기존 목업을 유지하거나 대표 상품명을 전체 상품 목록처럼 표시하면 실제 주문 내용을 정확히 보여주지 못한다.
- 주문 상세 화면의 배송지와 주문 금액/배송비 분리값은 상세 응답에 없으므로 목업을 실제 주문 데이터처럼 유지하지 않는다.

## Solution

주문 목록 API `GET /api/orders?status=CONFIRMED&page=0&size=20`에서 실제 결제 완료 주문을 가져온다. 목록 응답의 각 `orderId`에 대해 `GET /api/orders/{orderId}`를 조회하고 상세 응답의 `items`에서 상품명·가격·수량을 화면 모델로 변환한다 (`src/entities/order/api/get-orders.ts`, `src/entities/order/api/get-order-detail.ts`, `src/entities/order/model/order-history.ts`, `src/entities/order/api/use-order-history-query.ts`).

상세 라우트는 목업 ID 검사 없이 주문 ID로 API를 조회한다. 목록과 상세 모두 로딩·오류·빈 상태를 표시하며, 응답에 이미지 URL이 없으므로 중립적인 공용 placeholder를 사용한다. 상세 화면은 API에 있는 주문 ID·상태·상품 항목·결제 금액·결제 수단만 표시하고 배송지와 배송비/상품 금액 분리 행은 목업으로 대체하지 않는다 (`src/app/(main)/mypage/orders/[orderId]/page.tsx`, `src/views/mypage/ui/order-history-page.tsx`, `src/views/mypage/ui/order-detail-page.tsx`).

결제 승인 성공 후 주문 목록 query를 무효화해 목록 재진입 시 최신 주문을 다시 가져온다 (`src/views/payment/ui/payment-success-page.tsx`, `src/entities/order/model/query-key.ts`).

## Why This Works

주문 목록과 주문 상세는 API가 제공하는 정보 수준이 다르다. 목록의 요약 응답을 상품별 정보로 추정하지 않고, 각 실제 주문의 상세 응답을 사용해야 주문 내역 화면이 목업 없이 정확해진다. 상품 이미지나 배송 정보처럼 API에 없는 필드는 샘플 값으로 꾸미지 않고 표시 범위에서 제외하거나 placeholder로 처리한다.

## Prevention

- 화면에서 필요한 필드가 요약 API에 없으면 대표값을 상세 정보처럼 표시하지 말고 상세 API 계약과 조회 비용을 확인한다.
- 실제 ID를 목록 링크에 넣기 전에 해당 ID를 받는 상세 라우트의 목업 전용 가드를 제거하거나 서버 조회로 대체한다.
- 결제 성공 뒤 주문 목록을 무효화해 이전에 열었던 캐시가 최신 주문을 가리지 않게 한다.
- DTO에 제공되지 않는 상품 이미지·배송지·금액 구성은 실제 값인 것처럼 목업으로 노출하지 않는다.
