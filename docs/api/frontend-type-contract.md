# FE API 타입 계약 초안

## 목적

이 문서는 Swagger 계획 명세를 프론트엔드 타입 설계의 입력으로 정리한다. Swagger는 `draft`이며 일부 경로는 예시만 제공하므로, 여기의 타입은 구현 전 협의용 초안이다. 실제 API가 확정되면 Swagger, 이 문서, MSW handler를 함께 갱신한다.

## 공통 응답

```ts
export interface ApiSuccessResponse<T> {
  status: 'SUCCESS';
  message: string;
  data: T;
  error: null;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: 'ERROR';
  message: string;
  data: null;
  error: string | null;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

- HTTP 상태와 `status`를 함께 판단한다.
- `401`은 토큰 재발급 대상이고, 재발급도 실패하면 로그인 화면으로 이동한다.
- `data`가 배열인 조회 API에서 빈 배열은 Empty 상태다. `404`는 화면 문맥에 따라 Error로 처리한다.

## Auth

```ts
export type OAuthProvider = 'kakao' | 'naver';

export interface ReissueTokenData {
  accessToken: string;
}
```

| API                              | 요청                                     | 응답               | 비고                                                                            |
| -------------------------------- | ---------------------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| `GET /api/auth/login/{provider}` | path: `provider`, query: `code`, `state` | `302 Redirect`     | OAuth 제공자가 호출하는 BE 콜백이다. FE 로그인 시작 URL은 별도 확정이 필요하다. |
| `POST /api/auth/reissue`         | Refresh Token Cookie                     | `ReissueTokenData` | FE는 `credentials: 'include'`로 호출한다.                                       |
| `POST /api/auth/logout`          | Access Token, Refresh Token Cookie       | `null`             | FE 메모리의 Access Token도 삭제한다.                                            |

## User

```ts
export interface UserProfileDto {
  userId: number;
  provider: 'KAKAO' | 'NAVER';
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: 'ROLE_USER';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  nickname: string;
  profileImageUrl: string | null;
}

export interface UserPreferenceDto {
  preferenceId: number;
  userId: number;
  familyMemberCount: number;
  preferredFoodTypes: string[];
  allergies: string[];
  onboardingCompleted: boolean;
  onboardingStep: number;
  updatedAt: string;
}

export type UpdateUserPreferenceRequest = Pick<
  UserPreferenceDto,
  | 'familyMemberCount'
  | 'preferredFoodTypes'
  | 'allergies'
  | 'onboardingCompleted'
  | 'onboardingStep'
>;
```

## Pantry

```ts
export type PantryStorageType = 'REFRIGERATED' | 'FROZEN' | 'ROOMTEMP';

export interface CreatePantryRequestDto {
  ingredientName: string;
  expirationDate: string; // YYYY-MM-DD
  storageType: PantryStorageType;
  imageUrl: string | null;
}

export interface PantryDto {
  pantryId: number;
  ingredientName: string;
  expirationDate: string | null;
  dDay: number | null;
  isImminent: boolean;
  isExpired: boolean;
  storageType: PantryStorageType;
  registerType: 'MANUAL' | 'OCR';
  imageUrl: string | null;
  createdAt: string;
}
```

**협의 필요:** 등록 요청의 `ROOMTEMP`와 조회 응답 예시의 `ROOM_TEMP`가 다르다. API enum을 하나로 확정한 뒤 `PantryStorageType`을 갱신한다.

## Recipe

```ts
export interface RecipeSummaryDto {
  recipeId: number;
  title: string;
  foodType: string;
  cookingTimeMinutes: number;
  thumbnailUrl: string;
  mainIngredientNames: string[];
  matchCount: number;
  isFavorite: boolean;
}

export interface RecipeIngredientDto {
  ingredientId: number;
  ingredientName: string;
  requiredCapacity: string;
  isOwned: boolean;
  mappedProduct: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    productImageUrl: string;
  } | null;
}

export interface RecipeDetailDto extends RecipeSummaryDto {
  description: string;
  steps: Array<{ stepNumber: number; instruction: string }>;
  ingredients: RecipeIngredientDto[];
}
```

## Order and Payment

```ts
export interface CreateOrderRequestDto {
  cartId: number;
  selectedCartItemIds: number[];
}

export interface PreparePaymentDto {
  orderId: string;
  orderName: string;
  totalAmount: number;
  clientKey: string;
}

export interface ConfirmPaymentRequestDto {
  paymentKey: string;
  orderId: string;
  amount: number;
}
```

- 주문 생성·취소에는 `Idempotency-Key`가 필요하다.
- Swagger의 `X-User-Id`는 Gateway 주입값으로 설명된다. FE가 직접 전달하는지 확정 전까지 클라이언트에 고정하지 않는다.

## 타입 배치 원칙

```text
entities/<domain>/api/<domain>.dto.ts   // Swagger DTO
entities/<domain>/api/<domain>.mapper.ts // DTO → 화면 모델
entities/<domain>/model/                // 화면·도메인 모델
shared/api/api-response.ts              // ApiResponse<T>
```

Swagger DTO를 현재 카드·폼 UI 모델에 직접 사용하지 않는다. API 필드 변경은 mapper에서 흡수한다. `PantryDto`의 `isImminent` 임박 일수 기준은 백엔드가 계산해 내려주며, FE가 별도로 추정하지 않는다.
