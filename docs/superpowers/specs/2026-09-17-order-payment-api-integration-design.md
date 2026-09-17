# 주문·결제 API 연동 설계

## 목적

이슈 #70의 주문서 화면을 장바구니, 주문, 결제 API와 연결한다. 백엔드와 합동 테스트 전에도 타입, 요청 함수, 리다이렉트 화면, 오류 처리를 검증할 수 있어야 한다.

## 범위

- 장바구니 조회 결과의 `cartId`, `cartItemId`를 주문 생성에 사용한다.
- 결제하기 버튼에서 주문 생성, 결제 준비, 토스 결제창 요청을 순서대로 수행한다.
- 토스 성공 리다이렉트에서 백엔드 결제 승인을 요청한다.
- 토스 실패 리다이렉트와 백엔드 오류를 사용자에게 구분해 안내한다.
- 결제 조회·취소 UI와 운영용 주문 내역은 이번 범위에서 제외한다.

## 명세 가정과 변경 지점

- 합동 테스트 전까지 설명 문서를 우선해 장바구니 경로는 `/api/carts`를 사용한다.
- 기존 로그인에서 발급받은 Access Token을 `Authorization: Bearer` 헤더로 전달한다.
- 장바구니 단수·복수 경로와 인증 방식은 API 경로 상수와 헤더 생성 함수 한 곳에서 변경한다.
- 주문·결제 서비스는 기존 Gateway 프록시의 `/api/*` 브라우저 경로로 호출한다.
- 백엔드 Gateway 주소는 `BACKEND_API_BASE_URL`을 사용한다.
- 토스 테스트 키는 `NEXT_PUBLIC_TOSS_CLIENT_KEY`로 주입한다.

## 구조

- `entities/cart`: 장바구니 DTO, 조회 요청, 화면 모델 매핑
- `entities/order`: 주문 생성 DTO와 요청 함수
- `features/payment`: prepare·confirm 요청, 토스 SDK 어댑터, 결제 실행 상태
- `views/order`: 주문서 표시와 결제 실행 조합
- `views/payment`: 승인 처리 중·성공·실패 화면 조합
- `app`: `/order`, `/payment/success`, `/payment/fail` 라우팅만 담당

의존 방향은 `app → views → features → entities → shared`를 유지한다.

## 결제 흐름

1. 장바구니 화면은 API 응답의 숫자형 `cartItemId`를 선택 값으로 전달한다.
2. 주문서에서 필수 약관에 모두 동의한 사용자가 결제하기를 누른다.
3. 브라우저에서 `crypto.randomUUID()`로 멱등 키를 한 번 생성한다.
4. `POST /api/orders`에 `cartId`, 선택한 `cartItemId[]`, `Idempotency-Key`를 전달한다.
5. 서버 주문 응답의 `orderId`, `totalAmount`, `name`을 결제 기준값으로 사용한다.
6. `POST /api/payments/{orderId}/prepare`를 한 번 호출한다.
7. 토스 SDK v2의 리다이렉트 방식으로 `requestPayment()`를 호출한다.
8. 성공 URL은 `paymentKey`, `orderId`, `amount`를 검증하고 백엔드 `POST /api/payments/confirm`을 호출한다.
9. confirm 성공 후 결제 완료 상태를 표시한다. 재고 차감 API는 별도로 호출하지 않는다.

프론트 계산 금액은 화면 미리보기용으로만 사용하며 실제 결제 금액은 주문 생성 응답을 신뢰한다.

## 중복 요청 방지

- 결제 실행 중 버튼을 비활성화한다.
- 한 번의 결제 시도 동안 주문 멱등 키를 재사용한다.
- 주문이 생성된 뒤 재시도할 때 기존 `orderId`를 재사용하고 prepare를 다시 호출하지 않는다.
- 페이지를 새로 열어 시작한 결제 시도에는 새로운 멱등 키를 사용한다.
- `PAYMENT_IN_PROGRESS`는 중복 승인으로 재호출하지 않고 확인 중 상태로 안내한다.

## 성공 URL 검증

- `paymentKey`, `orderId`, `amount`가 하나라도 없으면 confirm을 호출하지 않는다.
- `amount`가 양의 정수가 아니면 confirm을 호출하지 않는다.
- 클라이언트에 보관한 주문 정보가 있으면 URL의 `orderId`, `amount`와 비교한다.
- 최종 금액 검증과 토스 Secret Key 사용은 백엔드가 담당한다.
- 성공 URL은 새로고침될 수 있으므로 confirm 호출 상태를 화면에 표시하고 백엔드의 중복 승인 방지 결과를 처리한다.

## 오류 처리

- 설정 누락: 필요한 환경변수 이름을 개발 환경에서 안내한다.
- 주문 생성 실패: 주문서에 오류를 표시하고 동일 멱등 키로 재시도할 수 있게 한다.
- prepare 실패: 결제창을 열지 않고 재시도 버튼을 제공한다.
- 토스 인증 실패: `/payment/fail`에서 `code`, `message`를 안전한 사용자 문구로 변환한다.
- `AMOUNT_MISMATCH`: 결제를 중단하고 주문 금액 갱신 안내를 표시한다.
- `PAYMENT_FAILED`: 다른 결제수단 또는 재시도 안내를 표시한다.
- `INSUFFICIENT_STOCK`: 자동 취소 사실과 장바구니 재확인 안내를 표시한다.
- `PAYMENT_IN_PROGRESS`: 중복 실행하지 않고 잠시 후 결제 조회가 필요함을 안내한다.
- 알 수 없는 오류: 주문 ID를 함께 제공하고 재시도 대신 문의 안내를 표시한다.

## 테스트

- API 요청 경로, 헤더, 본문, 멱등 키를 단위 테스트한다.
- 서버 주문 금액이 프론트 계산 금액보다 우선하는지 검증한다.
- 필수 파라미터 또는 금액이 잘못된 성공 URL에서 confirm이 호출되지 않는지 검증한다.
- 중복 클릭 시 주문·prepare가 각각 한 번만 호출되는지 검증한다.
- 주요 백엔드 오류 코드별 사용자 상태를 검증한다.
- 390px 주문서 UI와 기존 레이아웃 회귀 테스트를 유지한다.

## 합동 테스트 체크리스트

- 장바구니 API 경로는 `/api/carts` 사용
- Gateway JWT Bearer 인증 전달 확인
- Gateway 경유 여부와 실제 서비스 URL 확정
- 테스트 `userId`, 장바구니 상품, 토스 테스트 클라이언트 키 준비
- success·fail URL을 토스 개발자센터 허용 목록에 등록
- prepare 중복 생성 수정 여부 확인
- 타 사용자 장바구니 항목 소유권 검증 수정 여부 확인
