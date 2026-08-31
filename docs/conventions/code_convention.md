# 코드 컨벤션

## 목적

AI Pantry의 화면·상태·API 계약을 일관되게 구현하고, 기능이 늘어도 수정 범위를 예측할 수 있게 합니다.

## TypeScript

- 새 코드에는 TypeScript를 사용하고 `any`는 사용하지 않습니다. 외부 입력처럼 타입을 모르는 값은 `unknown`으로 받고 검증합니다.
- 서버 응답, 폼 값, 컴포넌트 Props에는 명시적인 타입을 둡니다.
- 상태 값과 분기 조건에는 매직 문자열 대신 union type 또는 상수를 사용합니다.
- `null`과 `undefined`의 의미를 섞지 않습니다. API 계약의 빈 값 표현을 먼저 확인합니다.

```ts
type PantryStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'CHECK_REQUIRED';

interface PantryItemProps {
  name: string;
  status: PantryStatus;
}
```

## 파일과 이름

- 파일·폴더는 `kebab-case`를 사용합니다. React 컴포넌트 파일도 `kebab-case.tsx`로 작성합니다.
- 컴포넌트·타입·인터페이스는 `PascalCase`, 함수·변수·훅은 `camelCase`를 사용합니다.
- boolean 값은 `is`, `has`, `can`, `should`로 시작합니다.
- 이벤트 핸들러는 `handle`로, Props로 전달하는 콜백은 `on`으로 시작합니다.

## FSD 디렉터리 책임

- `src/app`: Next.js App Router의 라우트, 레이아웃, Provider, 전역 스타일만 둡니다.
- `src/views`: 페이지 단위 화면 조합을 둡니다.
- `src/widgets`: 여러 feature·entity를 조합한 재사용 가능한 큰 UI 블록을 둡니다.
- `src/features`: 장바구니 담기, 팬트리 상태 확인처럼 사용자 행동 단위를 둡니다.
- `src/entities`: 팬트리 재료, 레시피, 상품 등 도메인 모델과 단위 UI를 둡니다.
- `src/shared/ui`: shadcn/ui 기반의 범용 UI를 둡니다. 도메인·페이지 규칙을 넣지 않습니다.
- `src/shared/lib`: 도메인에 종속되지 않는 유틸리티, API 클라이언트, 공통 설정을 둡니다.
- `src/mocks`: REST API 계약에 맞춘 MSW handler입니다.

의존 방향은 `app → views → widgets → features → entities → shared`입니다. 상위 레이어가 하위 레이어를 import하며, 하위 레이어가 상위 레이어를 참조하지 않습니다.

## React와 상태 관리

- 기본은 Server Component로 두고, 브라우저 API·이벤트·클라이언트 상태가 필요할 때만 `'use client'`를 선언합니다.
- 서버 상태는 TanStack Query, 전역 UI 상태는 Zustand, 폼은 React Hook Form + Zod를 사용합니다.
- 단일 화면에서만 쓰는 상태는 먼저 `useState`로 관리합니다.
- 비동기 UI에는 로딩·빈 데이터·오류·미인증 상태를 반드시 구현합니다.
- `useEffect`를 데이터 가공이나 파생 상태 저장에 사용하지 않습니다. 가능한 값은 렌더링 중 계산합니다.

## API와 MSW

- REST API 명세가 요청·응답의 기준입니다. 프론트엔드 화면 편의를 위해 응답 형태를 임의로 바꾸지 않습니다.
- API 타입, 요청 함수, MSW handler를 같은 계약 변경 단위로 함께 갱신합니다.
- 화면에서 필요한 형태로 변환이 필요하면 API 경계에서 명시적으로 변환합니다.
- API 실패 시 사용자에게 다음 행동이 가능한 메시지와 재시도 수단을 제공합니다.

## 제품 규칙

- 팬트리 상태는 `AVAILABLE`, `UNAVAILABLE`, `CHECK_REQUIRED`만 사용합니다.
- MVP에서 수량을 모르는 재료의 정확한 잔여량을 추정하거나 자동 차감하지 않습니다.
- 자주 구매한 상품은 제안만 하며, 사용자 확인 없이 장바구니에 추가하지 않습니다.
- 레시피에서 장바구니로 이동한 경우 레시피 맥락을 유지합니다.

## UI·접근성

- 390 × 844는 디자인 기준일 뿐 고정 화면 크기가 아닙니다. 360px, 390px, 430px 폭에서 가로 스크롤 없이 확인합니다.
- 의미 있는 이미지는 대체 텍스트를 제공하고, 장식 이미지는 빈 `alt`를 사용합니다.
- 아이콘만 있는 버튼에는 접근 가능한 이름을 제공합니다.
- 클릭 가능한 요소는 `button`, `a`, `input` 등 의미에 맞는 HTML 요소를 우선 사용합니다.
- 키보드 포커스와 색상 외 상태 표현을 제거하지 않습니다.

## 디자인 토큰

- 색상, 여백, 반경, 그림자는 [디자인 시스템](../design/design-system.md)의 토큰을 우선 사용합니다.
- 화면·위젯·feature 코드에 primitive 색상값(`#[0-9A-Fa-f]{6}`)을 직접 작성하지 않습니다. `bg-primary`, `text-foreground`, `border-border`처럼 semantic 토큰을 사용합니다.
- 버튼·카드·입력창처럼 반복되는 UI는 component 토큰과 `src/shared/ui` 공용 컴포넌트를 우선 사용합니다.
- 새 시각적 역할이 필요하면 `primitive → semantic → component` 순서로 토큰을 정의하고, `globals.css`와 디자인 시스템 문서를 함께 갱신합니다.
- 다크 모드 대응을 위해 화면 컴포넌트에서 라이트·다크 값을 분기해 하드코딩하지 않습니다. semantic 토큰을 통해 테마를 전환합니다.

## import와 주석

- import는 외부 패키지 → 내부 절대 경로(`@/`) → 상대 경로 순서로 정리합니다.
- 상대 경로는 같은 기능 내부의 가까운 파일에만 사용합니다.
- 코드가 무엇을 하는지 반복하는 주석 대신, 왜 필요한지 설명하는 주석만 남깁니다.
- `console.log`와 임시 코드, 사용하지 않는 import는 PR 전에 제거합니다.
