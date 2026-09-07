# BE API 협의 체크리스트

## 목적

Swagger가 계획 명세인 상태에서 FE 구현을 막는 계약 공백을 우선순위별로 확정한다. 각 항목은 합의 후 Swagger, FE 타입, MSW handler에 함께 반영한다.

## P0 개발 시작 전 확정

| 항목              | 현재 상태                          | BE와 확정할 내용                                                    | FE 영향                           |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------- | --------------------------------- |
| OAuth 로그인 시작 | Swagger에는 OAuth 콜백만 있음      | FE 로그인 버튼이 이동할 authorize URL, provider별 path, FE 콜백 URL | 소셜 로그인 버튼 연결 불가        |
| 쿠키·CORS         | 세부 값 미기재                     | 개발·운영 API/FE 도메인, `SameSite`, `Secure`, `AllowCredentials`   | `/auth/callback` 재발급 실패 가능 |
| 인증 헤더         | `Authorization`과 `X-User-Id` 혼재 | Gateway 주입 헤더 여부, FE 전송 헤더, 401 재발급 정책               | 공통 HTTP 클라이언트 설계         |
| Pantry 수정       | API 없음                           | `PATCH /api/pantries/{id}`, 수정 가능 필드, 오류 코드               | 수정 화면 연결 불가               |
| 이미지 업로드     | API 없음                           | multipart 업로드 또는 Presigned URL, `imageUrl` 생성 주체           | 이미지형 팬트리 화면 연결 불가    |
| Pantry enum       | 요청·응답 예시 불일치              | `ROOMTEMP` 또는 `ROOM_TEMP` 단일 값                                 | 타입·폼 유효성 검사               |
| Recipe 조건       | 목록 query 없음                    | 기한 임박, 주재료 다중 선택, 필터·정렬·페이지네이션                 | 레시피 탭·무한 스크롤 연결 불가   |
| Cart              | 경로만 존재                        | 요청·응답·수량·재고·총액·오류 계약                                  | 장바구니 실제 연동 불가           |

## P1 화면 연결 전 확정

| 항목      | 필요한 결정                                                |
| --------- | ---------------------------------------------------------- |
| 레시피 찜 | 추가·해제 endpoint, 낙관적 갱신 실패 복구                  |
| 조리 완료 | 팬트리 식재료 삭제·수정·선택 UX에 맞는 요청 모델           |
| 주문      | 주문 상태 enum, `Idempotency-Key` 생성·만료 규칙           |
| 결제      | Toss success/fail redirect URL, 승인 재시도·중복 승인 기준 |
| 배송      | 실제 배송 조회 여부, 데모용 수동 상태 변경 API와 표시 상태 |
| 홈        | 홈 전용 집계 API 또는 Pantry·Recipe 조합 호출 기준         |

## Swagger 품질 개선 요청

- `servers`에 개발·운영 Base URL을 명시한다.
- request/response의 `example`만 두지 말고 `schema`와 required 필드를 정의한다.
- `Authorization` header parameter 대신 `securitySchemes`와 operation `security`를 일관되게 사용한다.
- 실제 구현 여부를 endpoint별로 표시한다.
- Error code enum과 각 코드의 FE 처리 정책을 정리한다.

## 협의 결과 기록 양식

| 일자       | 항목               | 결정 | 담당 | Swagger 반영 | FE 타입·MSW 반영 |
| ---------- | ------------------ | ---- | ---- | ------------ | ---------------- |
| YYYY-MM-DD | 예: OAuth 시작 URL |      |      | ☐            | ☐                |
