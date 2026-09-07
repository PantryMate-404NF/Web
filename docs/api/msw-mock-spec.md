# MSW Mock 계약 명세

## 목적

실제 BE 배포 전에도 화면의 Loading, Content, Empty, Error 흐름을 API 계약과 같은 형태로 검증한다. MSW는 Next.js API Route를 대체하지 않으며, FE가 호출할 BE REST API를 브라우저와 테스트 환경에서 재현한다.

## 파일 배치

```text
src/mocks/
├── data/
│   ├── auth.ts
│   ├── pantry.ts
│   └── recipe.ts
└── handlers/
    ├── auth.ts
    ├── pantry.ts
    ├── recipe.ts
    └── index.ts
```

- `data/`: Swagger의 `ApiResponse<T>` 예시를 재현하는 고정 데이터
- `handlers/`: HTTP method, URL, 요청 검증, 상태별 응답
- `entities/*/model/mock.ts`: 화면 레이아웃 확인용 목업이며 API Mock과 분리한다.

## 현재 구현 범위

| Domain | Handler                  | 성공              | 예외 시나리오          |
| ------ | ------------------------ | ----------------- | ---------------------- |
| Auth   | `POST /api/auth/reissue` | Access Token 반환 | 401 Refresh Token 만료 |
| Pantry | `GET /api/pantries`      | 식재료 목록       | 빈 배열, 401, 500      |

아래 API는 Swagger 계약 확정 뒤 handler를 추가하는 후속 범위다.

| Domain | Handler                    | 성공             | 예외 시나리오 |
| ------ | -------------------------- | ---------------- | ------------- |
| User   | `GET /api/users/me`        | 프로필 반환      | 401, 404      |
| Pantry | `POST /api/pantries`       | 등록 식재료 반환 | 400, 401      |
| Pantry | `DELETE /api/pantries/:id` | `data: null`     | 403, 404      |
| Recipe | `GET /api/recipes`         | 레시피 목록      | 빈 배열, 401  |
| Recipe | `GET /api/recipes/:id`     | 레시피 상세      | 404           |

## Mock 시나리오 선택 방식

개발 중 화면 상태를 재현하기 위해 요청 query로 Mock 상태를 선택할 수 있다.

```text
GET /api/pantries?mock=empty
GET /api/pantries?mock=error
GET /api/recipes?mock=empty
```

이 query는 개발용 MSW에서만 소비하며, 실제 BE API 계약에 포함하지 않는다.

| `mock` 값      | HTTP | 응답 목적               |
| -------------- | ---- | ----------------------- |
| 없음           | 200  | 기본 Content 데이터     |
| `empty`        | 200  | `data: []` Empty 화면   |
| `unauthorized` | 401  | 인증 재발급·로그인 전환 |
| `forbidden`    | 403  | 권한 오류 안내          |
| `error`        | 500  | Error UI와 Retry CTA    |

## 요청 검증 기준

- Pantry 등록은 `ingredientName`, `expirationDate`, `storageType`, `imageUrl`를 확인한다.
- Pantry 삭제는 없는 `id`에 대해 404를 반환한다.
- 결제·주문·장바구니는 상세 Swagger 계약이 확정된 뒤 handler를 추가한다.
- 모든 handler는 공통 `ApiResponse<T>` 형식을 유지한다.

## 브라우저 MSW 활성화

`.env.local`에 `NEXT_PUBLIC_API_MOCKING=enabled`를 설정하면 `MockProvider`가 Service Worker 준비 후 화면을 렌더링한다. 실제 백엔드와 연결할 때는 이 값을 비워 둔다. `mockServiceWorker.js`는 `public/`에 유지한다.

## 갱신 규칙

1. BE 계약 변경 시 Swagger와 협의 문서를 먼저 갱신한다.
2. DTO와 mapper를 갱신한다.
3. MSW data와 handler를 같은 PR에서 갱신한다.
4. 성공·Empty·대표 오류 테스트를 함께 갱신한다.
