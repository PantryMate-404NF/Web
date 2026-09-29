---
title: OCR 영수증 흐름의 FE·BE 계약 경계와 구매일 매핑
date: 2026-09-29
category: architecture-patterns
module: 팬트리 OCR 영수증 등록
problem_type: architecture_pattern
component: frontend
severity: low
applies_when:
  - 'FE가 BFF를 통해 OCR 서비스에 영수증 이미지를 전달할 때'
  - 'OCR의 구매일을 팬트리 등록 API 필드로 옮길 때'
tags: [ocr, pantry, api-contract, purchase-date]
---

# OCR 영수증 흐름의 FE·BE 계약 경계와 구매일 매핑

## Context

영수증 OCR은 브라우저→애플리케이션 백엔드, 백엔드→비공개 AI 서버, 일반 팬트리 등록이라는 서로 다른 세 API 경계를 거친다. AI 서버 명세와 프론트엔드 명세가 함께 있을 때 브라우저가 AI API를 직접 호출하거나 내부 필드명을 그대로 사용하지 않도록 경계를 명확히 해야 한다.

## Guidance

- 브라우저에서는 AI 서버 주소와 `X-Internal-Api-Key`를 사용하지 않는다. 사용자를 인증하고 내부 키와 trace ID를 전달하는 애플리케이션 백엔드/BFF의 FE용 계약만 호출한다. 현재 FE 요청은 `POST /api/pantry-items/receipts`에 `file`, `receiptId`를 multipart로 전송하고 `X-Request-Id`를 전달한다 (`src/entities/pantry/api/recognize-receipt.ts:61-76`).
- multipart 본문을 보낼 때 `Content-Type`을 직접 설정하지 않는다. 브라우저가 boundary를 포함한 헤더를 생성하도록 둔다. 관련 요청 형태를 `src/entities/pantry/api/pantry-items.test.ts:117-127`에서 검증한다.
- 응답의 wire-format 필드 `receipt_id`, `purchased_at`은 API 경계에서 `receiptId`, `purchasedAt`으로 정규화해 UI에 전달한다 (`src/entities/pantry/api/recognize-receipt.ts:43-58`). 백엔드 확인에 따라 `purchased_at`에서 온 날짜는 팬트리 등록 요청의 `purchaseDate`로 보낸다. 해당 필드는 날짜가 있을 때만 등록 DTO에 포함된다 (`src/entities/pantry/api/pantry-request.ts:5-26`).
- OCR 네트워크 요청은 파일 선택이나 재시도 같은 명시적인 사용자 이벤트에서 시작한다. 마운트 effect에서 시작하면 React StrictMode의 effect 재실행으로 동일 요청이 중복될 수 있다. 현재 파일 선택 핸들러가 요청을 시작하고 (`src/views/pantry/ui/pantry-page.tsx:356-369`), 결과 화면은 전달받은 상태를 렌더링한다 (`src/views/pantry/ui/receipt-ocr-flow.tsx:16-27`).
- OCR 결과는 등록 전 수정 가능한 초안으로 취급한다. 사용자가 품목명, 구매일, 보관 방법을 확인·수정할 수 있게 하고, 항목별 등록이 일부 실패하면 성공한 항목을 재전송하지 않도록 실패 항목만 남긴다 (`src/views/pantry/ui/receipt-ocr-flow.tsx:176-240`).

## Why This Matters

브라우저에서 AI 서버를 직접 호출하면 비공개 서비스 경계와 내부 키가 노출되고, 백엔드 인증·추적 책임도 우회하게 된다. FE와 AI의 필드명을 혼용하면 BFF 계약이 바뀌지 않았는데도 요청이나 응답 해석이 깨질 수 있다. 특히 구매일은 OCR 응답의 `purchased_at`을 사용자 확인 화면에서 다룬 뒤, 팬트리 저장 API가 요구하는 `purchaseDate`로 변환해야 한다. multipart boundary 생성, 사용자 확인, 부분 실패 복구도 각각 업로드 실패·잘못된 데이터 저장·중복 등록을 방지한다.

## When to Apply

- 프론트엔드가 BFF를 통해 비공개 OCR/AI 서비스를 호출할 때
- 내부 AI 필드명과 공개 프론트엔드 또는 도메인 요청 필드명이 다를 때
- OCR 결과를 사용자가 검토한 후 여러 개의 도메인 레코드로 저장할 때
- 네트워크 요청을 React 화면 상태와 연결하면서 StrictMode 재실행 가능성이 있을 때

## Examples

OCR 응답 `{ "purchased_at": "2026-01-30" }`은 화면에서 구매일 초깃값으로 사용하고, 사용자가 확인한 날짜를 등록 API `{ "purchaseDate": "2026-01-30" }`로 보낸다. 응답 키를 등록 요청에 그대로 복사하지 않는다. 매핑은 `src/entities/pantry/api/recognize-receipt.ts:43-58`, `src/views/pantry/ui/receipt-ocr-flow.tsx:208-222`, `src/entities/pantry/api/pantry-request.test.ts:23-36`에서 확인할 수 있다.

## Related

- 관련된 기존 OCR/팬트리 연동 학습 문서는 없음.
