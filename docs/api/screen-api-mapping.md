# 화면별 API 매핑표

## 기준

- Swagger 원본: `Temporary Swagger document.json` (OpenAPI 3.0.3, draft)
- 확인일: 2026-09-03
- 주문·결제 명세 추가 확인일: 2026-09-17
- Pantry/Recipe OpenAPI 3.1.0 추가 확인일: 2026-09-29
- FE 연동 변경 문서 확인일: 2026-09-29
- USER/AUTH OpenAPI 배송지 계약 확인일: 2026-09-29
- 이 문서는 화면과 API 계약을 연결하기 위한 협의용 문서다.
- 장바구니 API는 `GET /api/carts`, `POST /api/carts/items`, `PATCH/DELETE /api/carts/items/{cartItemId}`와 `{ productId, quantity }`를 기준으로 한다.
- 화면 상태와 공용 UI 적용 기준은 [FE·PD 핸드오프 적용 기준](../design/fe-pd-handoff.md)을 따른다.
- 팬트리 목록 Error 화면은 TanStack Query의 `refetch`를 Retry CTA에 연결한다. Toast 정책은 후속 API 계약 범위다.
- 타입 초안은 [FE API 타입 계약 초안](./frontend-type-contract.md), MSW 시나리오는 [MSW Mock 계약 명세](./msw-mock-spec.md), BE 협의 항목은 [BE API 협의 체크리스트](./backend-alignment-checklist.md)를 기준으로 관리한다.

## 표기

| 상태      | 의미                                                     |
| --------- | -------------------------------------------------------- |
| 명세 있음 | Swagger에 경로, 메서드, 요청 또는 응답 예시가 정의됨     |
| 협의 필요 | 현재 화면에 필요하지만 Swagger에 계약이 없음 또는 부족함 |
| 범위 밖   | 현재 MVP 또는 화면 작업 범위에 포함하지 않음             |

## 공통 응답 및 UI 상태

Swagger의 성공·실패 응답은 아래 공통 형태를 사용한다.

```ts
interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  message: string;
  data: T | null;
  error: string | null;
  timestamp: string;
}
```

| API 결과          | 화면 상태    | FE 처리                                                        |
| ----------------- | ------------ | -------------------------------------------------------------- |
| 요청 진행         | Loading      | 최초 진입은 Skeleton, 등록·수정·삭제는 버튼 Loading + Disabled |
| 성공 + 데이터     | Content      | 응답 데이터 렌더링 또는 관련 캐시 갱신                         |
| 성공 + 빈 배열    | Empty        | 화면별 우선 CTA 1개 노출                                       |
| 400               | Error        | 필드 오류 또는 요청 오류 안내                                  |
| 401               | Unauthorized | 로그인 안내 또는 토큰 재발급 흐름                              |
| 403               | Error        | 권한 없음 안내                                                 |
| 404               | Error        | 대상 없음 안내 및 목록 재조회 고려                             |
| 5xx·네트워크 오류 | Error        | 기존 화면 유지, Toast 또는 재시도 CTA                          |

## 현재 화면 매핑

| 화면·라우트                             | 사용자 동작                 | API                                                                   | 상태        | FE 처리 및 데이터                                                                                                                  |
| --------------------------------------- | --------------------------- | --------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 홈 `/`                                  | 개인화 레시피 추천 확인     | `GET /api/recipes/recommendations`                                    | 명세 있음   | 로그인·온보딩 완료 후 `size=10`, `maxMinutes=30`, `includePantry=false`로 조회. 응답 순서와 `requestId`, `rank`를 상세 이동에 유지 |
| 팬트리 `/pantry`                        | 목록 조회                   | `GET /api/pantries`                                                   | 명세 있음   | `pantryId`, `ingredientName`, `expirationDate`, `dDay`, `isImminent`, `isExpired`, `storageType`, `registerType`, `imageUrl` 표시  |
| 팬트리 빈 상태                          | 목록이 비어 있음            | `GET /api/pantries`                                                   | 명세 있음   | 성공 + 빈 배열이면 Empty, CTA는 식재료 등록                                                                                        |
| 식재료 등록 `/pantry?state=register`    | 수기 등록                   | `POST /api/pantries`                                                  | 명세 있음   | 요청: `ingredientName`, `expirationDate`, `storageType`, `imageUrl`                                                                |
| 식재료 수정 `/pantry?state=edit`        | 기존 식재료 수정            | 없음                                                                  | 협의 필요   | `PATCH /api/pantries/{id}`의 요청·응답·권한 오류 계약 필요                                                                         |
| 식재료 삭제                             | 단건 삭제                   | `DELETE /api/pantries/{id}`                                           | 명세 있음   | 성공 시 카드 제거, 실패 시 기존 카드 유지 + Error Toast                                                                            |
| 식재료 이미지                           | 이미지 등록                 | 없음                                                                  | 협의 필요   | 업로드 API 또는 사전 서명 URL 방식, `imageUrl` 생성 주체 필요                                                                      |
| 레시피 목록 `/recipe`                   | 추천 목록 조회              | `GET /api/recipes`                                                    | 명세 있음   | 필터·정렬·페이지네이션 query 계약 확인 필요                                                                                        |
| 임박 재료 레시피 `/recipe/imminent`     | 임박 기준 추천 조회         | `GET /api/recipes`                                                    | 협의 필요   | 임박 전용 query parameter 또는 별도 API 필요                                                                                       |
| 재료 선택 `/recipe/ingredients`         | 재료 기반 추천              | `GET /api/recipes`                                                    | 협의 필요   | 선택 재료 전달 방식(query/body), 다중 선택·빈 선택 기준 필요                                                                       |
| 레시피 상세 `/recipe/{recipeId}`        | 상세 재료·조리 순서         | `GET /api/recipes/{recipeId}`                                         | 명세 있음   | 레시피 정보, `ingredients`와 `steps`; 상품 매칭은 별도 API                                                                         |
| 레시피 상품 매칭                        | 보유·부족 재료 및 상품 확인 | `GET /api/recipes/{recipeId}/product-match`                           | 명세 있음   | `hasIngredient`, `matchStatus`와 매칭 시 `product`; g 단위·필요량이 있는 재료만 상품 매칭                                          |
| 상품 상세 `/product/{productId}`        | 상품 상세 조회              | `GET /api/products/{productId}`                                       | 실응답 확인 | 서버 `productId`, 가격, 이미지, 재고, 판매 상태를 사용하고 디자인 전용 배송·리뷰 정보는 기존 화면 메타데이터로 보완                |
| 조리 완료 `/recipe/{recipeId}/complete` | 사용 식재료 정리            | 없음                                                                  | 협의 필요   | 조리 완료 후 팬트리 항목 삭제·수정 여부와 요청 계약 필요                                                                           |
| 레시피 찜                               | 찜 상태 변경                | 없음                                                                  | 협의 필요   | `isFavorite`은 응답에 있으나 변경 API가 없음. 낙관적 갱신·실패 복구 기준 필요                                                      |
| 장바구니 `/cart`                        | 장바구니 조회               | `GET /api/carts`                                                      | 명세 있음   | 상품·수량·가격 데이터 렌더링                                                                                                       |
| 부족 상품 담기                          | 상품 추가                   | `POST /api/carts/items`                                               | 명세 있음   | 상품 매칭 API의 `productId`를 사용해 `{ productId, quantity: 1 }` 전송. 매칭 API 설명의 `/api/cart/items`와 경로 불일치 확인 필요  |
| 장바구니 수량 변경                      | 수량 증감                   | `PATCH /api/carts/items/{cartItemId}`                                 | 명세 있음   | 요청 중 Stepper Disabled, 실패 시 이전 수량 복구                                                                                   |
| 장바구니 항목 삭제                      | 항목 삭제                   | `DELETE /api/carts/items/{cartItemId}`                                | 명세 있음   | 성공 시 항목 제거, 실패 시 기존 항목 유지 + Error Toast                                                                            |
| 주문서 `/order`                         | 선택 상품 주문 생성         | `POST /api/orders`                                                    | 명세 있음   | 선택 항목·기본 배송지(`deliveryAddress`)와 `Idempotency-Key` 전송                                                                  |
| 주문서 `/order`                         | 결제 준비                   | `POST /api/payments/{orderId}/prepare`                                | 명세 있음   | 중복 호출 방지를 위해 실행 중 CTA 비활성화. 성공 후에만 토스 결제창 요청                                                           |
| 결제 성공 `/payment/success`            | 결제 승인                   | `POST /api/payments/confirm`                                          | 명세 있음   | 토스 리다이렉트의 `paymentKey`, `orderId`, `amount`를 검증해 전달. 재고 차감은 서버에서 처리                                       |
| 결제 실패 `/payment/fail`               | 실패 안내                   | 없음                                                                  | 명세 있음   | 토스의 `code`를 고정 사용자 문구로 변환하고 주문서 복귀 제공                                                                       |
| 결제 조회·취소                          | 상태 확인·취소              | `GET /api/payments/{orderId}`, `POST /api/payments/{orderId}/cancel`  | 취소 연동   | 취소 요청 body에는 `{ cancelReason }`만 전송하고 성공 후 주문 목록·상세 캐시를 갱신                                                |
| 배송지 목록 `/mypage/addresses`         | 목록 조회                   | `GET /api/users/me/addresses`                                         | 명세 있음   | 기본 배송지 우선, 이후 최근 등록순으로 표시                                                                                        |
| 배송지 추가                             | 우편번호 검색               | Kakao 우편번호 서비스                                                 | 명세 있음   | `zonecode`를 `zipCode`, 도로명·지번 주소를 `address`로 사용                                                                        |
| 배송지 추가                             | 배송지 등록                 | `POST /api/users/me/addresses`                                        | 명세 있음   | 첫 배송지는 서버가 자동으로 기본 배송지로 설정                                                                                     |
| 배송지 수정                             | 정보 수정                   | `PATCH /api/users/me/addresses/{addressId}`                           | 명세 있음   | 전체 필수 필드를 다시 전송하고 기본 배송지 변경은 별도 API 사용                                                                    |
| 배송지 수정                             | 수정·기본 설정              | `PATCH /api/users/me/addresses/{addressId}`, `PATCH .../{id}/default` | 명세 있음   | 성공 시 목록과 주문서 기본 배송지 캐시 갱신                                                                                        |
| 주문서 `/order`                         | 기본 배송지 조회            | `GET /api/users/me/addresses/default`                                 | 명세 있음   | `data: null`이면 배송지 변경·추가 진입점을 유지                                                                                    |
| 마이페이지 회원 수정 `/mypage/edit`     | 프로필 정보 저장            | `PATCH /api/users/me`                                                 | 명세 있음   | 부분 수정으로 닉네임·휴대폰 번호·생년월일 전송. 휴대폰 번호는 숫자만 10~11자리, 성공 응답으로 프로필 캐시 갱신                     |

## 팬트리 등록 계약

### 요청

```ts
type PantryStorageType = 'REFRIGERATED' | 'FROZEN' | 'ROOMTEMP';

interface CreatePantryRequest {
  ingredientName: string;
  expirationDate: string; // YYYY-MM-DD
  storageType: PantryStorageType;
  imageUrl: string | null;
}
```

### 주요 오류 코드

| 오류 코드                | UI 처리                           |
| ------------------------ | --------------------------------- |
| `PANTRY-INVALID-NAME`    | 식재료명 입력 Error               |
| `PANTRY-INVALID-DATE`    | 소비기한 입력 Error               |
| `PANTRY-INVALID-STORAGE` | 보관 방법 입력 Error              |
| `AUTH-INVALID-TOKEN`     | 인증 갱신 또는 로그인 안내        |
| `USER-NOTFOUND-ID`       | 로그인 상태 확인 안내             |
| `SYS-INTERNAL-ERROR`     | 폼 값 유지 + Error Toast + 재시도 |

## 백엔드·PD 협의 필요 목록

| 우선순위 | 항목             | 필요한 결정                                                      |
| -------- | ---------------- | ---------------------------------------------------------------- |
| 높음     | 팬트리 수정      | `PATCH /api/pantries/{id}` 요청·응답, 수정 가능 필드, 오류 코드  |
| 높음     | 이미지 업로드    | 업로드 endpoint 또는 URL 발급 방식, 기본 이미지 URL              |
| 높음     | 팬트리 조회 조건 | `storageType`, 소비기한 상태, 정렬, 페이지네이션 query parameter |
| 높음     | 조리 완료 처리   | 팬트리 삭제·수정 방식, 사용자 확인 후 요청 시점                  |
| 높음     | 찜 변경          | 찜 추가·해제 endpoint, 낙관적 갱신 및 실패 복구                  |
| 중간     | 레시피 목록 조건 | 임박 추천·재료 선택의 요청 파라미터와 빈 결과 기준               |
| 중간     | 배송 자동 등록   | 배송 완료 이벤트 전달 방식과 자동 등록 API                       |
| 완료     | 주문·결제 인증   | 기존 로그인 Access Token을 Gateway JWT Bearer 인증으로 전달      |
| 높음     | 결제 중복 준비   | 같은 주문의 prepare 중복 레코드 생성 방지 적용 여부              |
