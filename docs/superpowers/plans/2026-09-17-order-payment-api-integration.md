# Order Payment API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 주문서에서 실제 장바구니 항목으로 주문을 생성하고 토스 결제 인증 및 백엔드 승인을 완료하는 프론트 흐름을 구현한다.

**Architecture:** 주문·결제 서비스는 `/order-api` Next rewrite 뒤의 전용 HTTP 클라이언트로 접근한다. Cart·Order DTO는 entities에, 결제 실행과 토스 SDK 어댑터는 features에, 화면 상태 조합은 views에 두며 app은 검색 파라미터 전달만 담당한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, TanStack Query, TossPayments JavaScript SDK v2, Vitest

**Spec:** `docs/superpowers/specs/2026-09-17-order-payment-api-integration-design.md`

## Global Constraints

- 390 × 844 CSS px를 기준으로 기존 주문서 레이아웃을 유지한다.
- 설명 문서 기준 `/api/carts`와 `X-User-Id`를 사용하되 한 파일에서 변경 가능하게 한다.
- 실제 결제 금액은 주문 생성 응답의 `totalAmount`만 사용한다.
- 토스 Secret Key와 승인 API 직접 호출은 브라우저에 두지 않는다.
- 모든 새 API 함수는 공통 응답의 `data`만 반환하고 서버 오류 코드를 보존한다.
- 테스트를 먼저 실패시킨 후 최소 구현으로 통과시킨다.

---

### Task 1: 주문·결제 서비스 클라이언트와 프록시

**Files:**

- Modify: `.env.example`
- Modify: `next.config.ts`
- Create: `src/shared/api/order-payment-client.ts`
- Test: `src/shared/api/order-payment-client.test.ts`

**Interfaces:**

- Produces: `orderPaymentRequest<T>(path, options): Promise<T>`
- Produces: `getOrderPaymentTestUserId(): string`

- [ ] **Step 1: 실패 테스트 작성**

`fetch`를 mock해 `/order-api/carts` 호출, `X-User-Id`, JSON body, 오류 코드 보존을 검증한다.

- [ ] **Step 2: 실패 확인**

Run: `npm run test -- src/shared/api/order-payment-client.test.ts`

Expected: 모듈이 없어 FAIL.

- [ ] **Step 3: 최소 구현**

`NEXT_PUBLIC_API_BASE_URL` 뒤에 `/order-api`를 붙이고 공통 응답을 해석하는 클라이언트를 구현한다. `next.config.ts`에는 `ORDER_PAYMENT_API_BASE_URL`이 있을 때만 `/order-api/:path* → {base}/api/:path*` rewrite를 추가한다.

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test -- src/shared/api/order-payment-client.test.ts`

- [ ] **Step 5: 정적 검증**

Run: `npm run typecheck && npm run lint`

### Task 2: Cart·Order·Payment API 계약

**Files:**

- Create: `src/entities/cart/api/cart.dto.ts`
- Create: `src/entities/cart/api/get-cart.ts`
- Create: `src/entities/order/api/order.dto.ts`
- Create: `src/entities/order/api/create-order.ts`
- Create: `src/features/payment/api/payment.dto.ts`
- Create: `src/features/payment/api/prepare-payment.ts`
- Create: `src/features/payment/api/confirm-payment.ts`
- Test: `src/entities/order/api/create-order.test.ts`
- Test: `src/features/payment/api/payment-api.test.ts`

**Interfaces:**

- Produces: `getCart(): Promise<CartResponseDto>`
- Produces: `createOrder(input, idempotencyKey): Promise<OrderCreateResponseDto>`
- Produces: `preparePayment(orderId): Promise<PaymentPrepareResponseDto>`
- Produces: `confirmPayment(input): Promise<PaymentConfirmResponseDto>`

- [ ] **Step 1: 주문 요청 실패 테스트 작성**

`cartId`, `selectedCartItemIds`, `Idempotency-Key`가 정확히 전달되는지 검증한다.

- [ ] **Step 2: 결제 요청 실패 테스트 작성**

prepare 경로와 confirm의 `paymentKey`, `orderId`, `amount` 본문을 검증한다.

- [ ] **Step 3: 실패 확인**

Run: `npm run test -- src/entities/order/api/create-order.test.ts src/features/payment/api/payment-api.test.ts`

- [ ] **Step 4: DTO와 요청 함수 최소 구현**

문서의 숫자·문자열 타입과 상태 유니온을 정의하고 전용 클라이언트를 호출한다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm run test -- src/entities/order/api/create-order.test.ts src/features/payment/api/payment-api.test.ts`

### Task 3: 결제 실행 모델과 토스 SDK 어댑터

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/features/payment/model/payment-flow.ts`
- Create: `src/features/payment/model/payment-flow.test.ts`
- Create: `src/features/payment/lib/request-toss-payment.ts`
- Test: `src/features/payment/lib/request-toss-payment.test.ts`

**Interfaces:**

- Produces: `executePayment(input, dependencies): Promise<void>`
- Produces: `requestTossPayment(order): Promise<void>`
- Consumes: Task 2의 `createOrder`, `preparePayment`

- [ ] **Step 1: 실행 순서와 중복 방지 실패 테스트 작성**

한 실행에서 `createOrder → preparePayment → requestTossPayment` 순서를 검증하고 동시에 두 번 호출해도 각 의존성이 한 번만 호출되는지 검증한다.

- [ ] **Step 2: 서버 금액 우선 실패 테스트 작성**

토스 요청에 로컬 합계가 아닌 `OrderCreateResponseDto.totalAmount`가 전달되는지 검증한다.

- [ ] **Step 3: 실패 확인**

Run: `npm run test -- src/features/payment/model/payment-flow.test.ts`

- [ ] **Step 4: SDK 설치와 최소 구현**

`@tosspayments/tosspayments-sdk`를 설치하고 `payment.requestPayment()`에 `CARD`, KRW 금액, 주문 ID·이름, 절대 success/fail URL을 전달한다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm run test -- src/features/payment/model/payment-flow.test.ts src/features/payment/lib/request-toss-payment.test.ts`

### Task 4: 장바구니·주문서 연결

**Files:**

- Modify: `src/entities/cart/model/cart-store.ts`
- Modify: `src/views/cart/ui/cart-page.tsx`
- Modify: `src/features/order/model/order-sheet.ts`
- Modify: `src/views/order/ui/order-page.tsx`
- Modify: `src/app/(main)/order/page.tsx`
- Test: `src/views/cart/ui/cart-page.test.tsx`
- Test: `src/views/order/ui/order-page.test.ts`

**Interfaces:**

- Cart item carries optional numeric `cartItemId` and the cart snapshot carries `cartId`.
- Order page supplies `{ cartId, selectedCartItemIds }` to `executePayment`.

- [ ] **Step 1: API 장바구니 선택값 실패 테스트 작성**

주문 링크가 상품 mock ID가 아니라 숫자형 `cartItemId`를 전달하는지 검증한다.

- [ ] **Step 2: 결제 버튼 상태 실패 테스트 작성**

필수 약관 미동의·실행 중에는 비활성이고 오류 시 재시도 가능한 상태를 검증한다.

- [ ] **Step 3: 실패 확인**

Run: `npm run test -- src/views/cart/ui/cart-page.test.tsx src/views/order/ui/order-page.test.ts`

- [ ] **Step 4: 화면 조합 최소 구현**

백엔드 장바구니를 조회해 기존 카드 UI에 매핑하고, 개발 `preview=1`은 기존 mock을 유지한다. 결제 버튼은 실행 중 한 번만 동작하며 오류 메시지를 `role="alert"`로 제공한다.

- [ ] **Step 5: 테스트와 390px 회귀 확인**

Run: `npm run test -- src/views/cart/ui/cart-page.test.tsx src/views/order/ui/order-page.test.ts`

### Task 5: 결제 성공·실패 리다이렉트

**Files:**

- Create: `src/features/payment/model/payment-redirect.ts`
- Test: `src/features/payment/model/payment-redirect.test.ts`
- Create: `src/views/payment/ui/payment-success-page.tsx`
- Create: `src/views/payment/ui/payment-fail-page.tsx`
- Create: `src/app/(main)/payment/success/page.tsx`
- Create: `src/app/(main)/payment/fail/page.tsx`
- Test: `src/views/payment/ui/payment-page.test.ts`

**Interfaces:**

- Produces: `parsePaymentSuccessParams(params): PaymentConfirmRequestDto | null`
- Consumes: Task 2의 `confirmPayment`

- [ ] **Step 1: 성공 URL 검증 실패 테스트 작성**

필수 값 누락, 0·음수·소수·숫자가 아닌 amount를 거부하고 유효한 양의 정수만 DTO로 반환하는지 검증한다.

- [ ] **Step 2: 오류 코드 매핑 실패 테스트 작성**

`AMOUNT_MISMATCH`, `PAYMENT_FAILED`, `INSUFFICIENT_STOCK`, `PAYMENT_IN_PROGRESS`가 서로 다른 안내로 변환되는지 검증한다.

- [ ] **Step 3: 실패 확인**

Run: `npm run test -- src/features/payment/model/payment-redirect.test.ts src/views/payment/ui/payment-page.test.ts`

- [ ] **Step 4: 리다이렉트 화면 구현**

성공 화면은 confirm을 한 번 실행하고 처리 중·완료·오류 상태를 표시한다. 실패 화면은 토스의 `code`, `message`를 안전한 고정 문구와 함께 표시하고 주문서로 돌아가는 링크를 제공한다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm run test -- src/features/payment/model/payment-redirect.test.ts src/views/payment/ui/payment-page.test.ts`

### Task 6: 전체 검증과 연동 안내

**Files:**

- Modify: `.env.example`
- Modify: `docs/api/screen-api-mapping.md`

**Interfaces:**

- Documents the four required environment values and backend contract assumptions.

- [ ] **Step 1: 환경변수와 화면별 API 매핑 기록**

`ORDER_PAYMENT_API_BASE_URL`, `NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID`, `NEXT_PUBLIC_TOSS_CLIENT_KEY`, success/fail 경로를 기록한다.

- [ ] **Step 2: 전체 자동 검증**

Run: `npm run test && npm run check && npm run build`

- [ ] **Step 3: 로컬 시나리오 확인**

390px에서 장바구니 선택 → 주문서 → 약관 동의 → 설정 누락 안내 또는 토스 결제창 호출 → success/fail 화면을 확인한다.

- [ ] **Step 4: 변경 범위 확인**

Run: `git status --short && git diff --check`
