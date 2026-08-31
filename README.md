# PantryMate Web

PantryMate는 사용자의 식재료 구매 이력을 바탕으로 팬트리를 구성하고, 현재 만들 수 있는 레시피를 추천하며, 부족한 재료를 장바구니와 구매까지 연결하는 **모바일 웹 기반 신선식품 이커머스 서비스**입니다.

## 프로젝트가 해결하려는 문제

| 사용자 문제                                       | AI Pantry의 해결 방식                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| 냉장고에 어떤 식재료가 있는지 기억하기 어렵다     | 주문 수령 상품을 팬트리 후보로 만들고, 짧은 상태 확인을 제공합니다.   |
| 메뉴를 정한 뒤에도 필요한 재료를 다시 찾아야 한다 | 레시피에서 보유·부족 재료를 구분하고 부족 재료만 장바구니에 담습니다. |
| 남은 식재료를 활용하지 못해 폐기할 수 있다        | 남은 재료와 소비기한을 바탕으로 활용 레시피를 제안합니다.             |
| 반복 구매 상품을 매번 다시 찾아야 한다            | 구매 이력에 기반한 재구매 후보를 제안합니다.                          |
| 동거인과 장보기·식재료 정보가 분리된다            | 고도화 단계에서 공유 팬트리와 공유 장바구니를 제공합니다.             |

## 핵심 사용자 흐름

```text
구매 이력 → 팬트리 후보 → 사용자 상태 확인 → 레시피 추천
→ 부족 재료 장바구니 → 주문·수령 → 다음 팬트리 후보
```

MVP에서는 재료의 정확한 잔여 수량을 추정하지 않습니다. 팬트리는 요리 가능 여부, 소비기한 상태, 등록 방식을 분리해 관리합니다.

| 구분           | 값                                  | 의미                                      |
| -------------- | ----------------------------------- | ----------------------------------------- |
| 요리 가능 여부 | `ON` / `OFF`                        | 레시피 추천에 사용할 수 있는지            |
| 소비기한 상태  | `정상` / `임박` / `경과` / `미등록` | 소비기한 정보를 기준으로 한 표시 상태     |
| 등록 방식      | `자동` / `수동`                     | 배송 완료 자동 등록 또는 사용자 직접 등록 |

## 프로토타입 목업 화면

실제 API가 준비되기 전, Figma 프로토타입의 핵심 흐름을 확인하기 위한 목업 화면입니다. 화면 구조는 실제 구현 예정인 FSD 레이어와 App Router 경로에 배치되어 있으며, 확정 전 와이어프레임에는 디자인 토큰을 아직 적용하지 않습니다.

| 경로                              | 확인할 화면                         |
| --------------------------------- | ----------------------------------- |
| `/`                               | 목업 화면 진입 목록                 |
| `/pantry`                         | 팬트리 아이콘형 보유 식재료 목록    |
| `/pantry?view=image`              | 팬트리 이미지형 보유 식재료 목록    |
| `/pantry?state=empty`             | 팬트리 빈 상태                      |
| `/pantry?state=delivery-complete` | 배송 완료 후 자동 등록 팝업         |
| `/pantry?state=edit`              | 식재료 등록·수정 화면               |
| `/pantry?state=delete-confirm`    | 식재료 삭제 확인 바텀시트           |
| `/recipe`                         | 주재료 기반 레시피 추천             |
| `/recipe/imminent`                | 소비기한 임박 재료 기반 레시피 추천 |
| `/recipe/ingredients`             | 주재료 선택용 식재료 그리드         |
| `/recipe/kimchi-stew`             | 레시피 상세와 부족 재료 확인        |

## 기술 스택

| 영역         | 기술 및 버전                                           | 적용 목적                                                |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------- |
| 프레임워크   | Next.js `16.3.1` / React `19.2.8` / TypeScript `6.0.3` | 라우팅, 렌더링 전략, 타입 안정성                         |
| 스타일       | Tailwind CSS `4.3.3` + shadcn/ui                       | 모바일 우선 UI와 재사용 가능한 공통 컴포넌트             |
| 서버 상태    | TanStack Query `5.101.4`                               | API 캐싱, 로딩·오류·재시도 상태 관리                     |
| 전역 UI 상태 | Zustand `5.0.15`                                       | 바텀시트, 토스트, 임시 선택 상태 관리                    |
| 폼·검증      | React Hook Form `7.85.0` + Zod `4.4.3`                 | 팬트리 확인·알림 설정 등의 입력 검증                     |
| API 모킹     | MSW `2.15.0`                                           | REST API 명세 기반의 프론트엔드 선개발 및 예외 처리 검증 |
| 인증         | 카카오·네이버 OAuth                                    | 자체 이메일 로그인 없이 소셜 로그인 2종만 제공           |
| PWA          | Next.js Manifest + Service Worker                      | 설치 가능한 모바일 웹 경험 제공                          |
| 아이콘       | Lucide React                                           | 일관된 접근 가능한 UI 아이콘                             |
| 테스트       | Vitest `4.1.11`                                        | 도메인 로직과 컴포넌트 테스트                            |
| 코드 포맷    | Prettier + Tailwind 플러그인                           | 일관된 코드 형식과 Tailwind 클래스 정렬                  |
| Git 훅       | Husky                                                  | 커밋 전 포맷·린트·타입 검사 자동 실행                    |

## PWA 범위

초기 단계에서는 Manifest, 앱 아이콘, 설치 가능 구조, 서비스 워커 등록을 제공합니다. 주문·팬트리·장바구니 API 응답은 캐시하지 않습니다. 오프라인 동작 범위가 합의된 후 정적 자산부터 제한적으로 캐싱합니다.

## 인증 범위

MVP는 **카카오·네이버 소셜 로그인만** 제공합니다. 자체 이메일 회원가입·로그인, 비밀번호 재설정, 이메일 인증은 구현 범위에서 제외합니다. 소셜 로그인 완료 후 서비스의 로그인 상태는 백엔드가 발급한 토큰 정책을 따르며, 제공자별 인가 코드와 비밀 값은 프론트엔드에 보관하지 않습니다.

## 시작하기

### 요구 환경

- Node.js 20 이상 권장
- npm

### 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

### 주요 명령어

| 명령어                        | 설명                                      |
| ----------------------------- | ----------------------------------------- |
| `npm run dev`                 | Turbopack 기반 개발 서버 실행             |
| `npm run lint`                | ESLint 검사                               |
| `npm run typecheck`           | TypeScript 타입 검사                      |
| `npm run check:design-tokens` | Pretendard·색상·테마·반응형 토큰 검사     |
| `npm run check`               | 디자인 토큰·포맷·린트·타입 통합 검사      |
| `npm run test`                | Vitest 테스트 실행                        |
| `npm run build`               | 디자인 토큰 검사 후 webpack 프로덕션 빌드 |
| `npm run check:workflow`      | 브랜치·커밋·작업 트리 점검                |
| `npm run start`               | 프로덕션 서버 실행                        |

> 현재 환경에서는 Next.js 16의 Turbopack 프로덕션 빌드가 불안정할 수 있어, 재현 가능한 검증을 위해 `npm run build`는 webpack을 사용합니다.

## 폴더 구조와 코드 배치 기준

프로젝트는 FSD(Feature-Sliced Design) 의존 방향을 따릅니다.

```text
app → views → widgets → features → entities → shared
```

상위 레이어는 하위 레이어를 가져올 수 있지만, 반대 방향 import는 금지합니다. 예를 들어 `entities/pantry`는 `views/pantry`를 import할 수 없습니다.

### 현재 폴더 구조

```text
src/
├── app/                              # Next.js App Router: URL과 전역 설정
│   ├── (main)/                        # 사용자 화면 라우트 그룹
│   │   ├── pantry/page.tsx            # /pantry의 searchParams를 화면에 전달
│   │   ├── recipe/                    # 레시피 목록·상세 URL
│   ├── layout.tsx                     # 루트 레이아웃
│   ├── providers.tsx                  # Query Client 등 전역 Provider
│   ├── globals.css                    # 전역 스타일·디자인 토큰
│   └── manifest.ts                    # PWA Manifest
├── views/                            # 페이지 단위 화면 조합
│   ├── pantry/ui/                     # 팬트리 목록·빈 상태·등록/삭제 흐름
│   └── recipe/ui/                     # 레시피 목록·상세 화면
├── widgets/                          # 여러 entity/feature를 묶는 큰 UI 블록
│   ├── pantry-list/ui/                # 팬트리 헤더·필터·2열 그리드
│   └── app-shell/ui/                  # 모바일 화면 프레임
├── features/                         # 사용자의 행동 단위 (현재 초기 폴더)
├── entities/                         # 도메인 데이터와 단위 UI
│   ├── pantry/                        # PantryItem 타입·목업·카드
│   └── recipe/                        # Recipe 타입·목업
├── components/                       # 전환 중인 공용 UI
│   ├── ui/                            # 현재 shadcn/ui 컴포넌트
│   └── pwa/                           # 서비스 워커 등록
├── lib/                              # 전환 중인 공용 유틸리티
│   └── utils/                         # cn 등 공통 함수
└── mocks/                            # MSW browser/server/handlers

public/                               # 정적 이미지, 아이콘, service worker
docs/                                 # 제품·아키텍처·API·컨벤션 문서
```

`components/`, `lib/`는 스캐폴드에서 남아 있는 공용 코드 위치입니다. 새 공용 코드는 아래 목표 구조를 우선 사용하고, 기존 코드는 기능 작업 중 관련 범위에서만 점진적으로 이동합니다. 단순 정리를 위해 unrelated 파일을 한 번에 옮기지 않습니다.

```text
src/shared/
├── ui/                               # 여러 도메인에서 재사용하는 shadcn/ui 래퍼
├── lib/                              # API client, query client, 공통 유틸
├── config/                           # 환경별 API URL, 상수, feature flag
└── assets/                           # 코드에서 import하는 공용 정적 자산
```

### 어디에 무엇을 만들지

| 만들 대상                                          | 둘 위치                 | 예시                                                                | 두면 안 되는 곳                      |
| -------------------------------------------------- | ----------------------- | ------------------------------------------------------------------- | ------------------------------------ |
| URL, 페이지 메타데이터, `searchParams` 해석        | `src/app`               | `/pantry?view=image`를 `PantryFlowPage`에 전달                      | `entities`, `widgets`                |
| 한 URL을 완성하는 화면 조합                        | `src/views/<domain>/ui` | `pantry-page.tsx`, `recipe-list-page.tsx`                           | `app/page.tsx`에 모든 마크업 작성    |
| 여러 화면에서 조합해 쓰는 큰 UI                    | `src/widgets/<name>/ui` | 팬트리 헤더·필터·그리드                                             | `shared`에 페이지 맥락 UI 배치       |
| 클릭·제출·선택 같은 사용자 행동                    | `src/features/<action>` | `add-pantry-item`, `toggle-recipe-save`, `add-recipe-items-to-cart` | `entities`에 API 호출과 폼 상태 혼합 |
| 도메인 타입, API DTO, 단위 카드                    | `src/entities/<domain>` | `PantryItem`, `pantry-item-card.tsx`                                | `views`에서 도메인 타입 중복 선언    |
| 어느 도메인에도 종속되지 않는 버튼·다이얼로그·유틸 | `src/shared`            | `Button`, `cn`, API client                                          | 특정 화면 전용 컴포넌트              |
| API 명세 기반 응답과 에러 재현                     | `src/mocks/handlers`    | `GET /pantry/items`, cursor 페이지 응답                             | 페이지 컴포넌트 내부 더미 배열       |
| 실제 이미지·아이콘·폰트                            | `public/` 또는 CDN URL  | 상품 이미지, PWA 아이콘                                             | `src`에 무분별한 바이너리 저장       |

### 현재 팬트리 구현의 연결 관계

```text
/pantry, /pantry?view=image
  └─ src/app/(main)/pantry/page.tsx
      └─ PantryFlowPage: state/full·empty·edit 같은 목업 흐름 선택
          └─ PantryPage: 화면 상태와 카드 표현 방식 선택
              ├─ PantryHeader / PantryToolbar / PantryGrid (widgets)
              └─ PantryItemCard (entities)
                  ├─ icon: 아이콘형 카드, 173 × 104px
                  └─ image: 이미지형 카드, 175 × 203px
```

현재는 두 목업을 비교하기 위해 `view` query parameter를 사용합니다.

| URL                  | 카드 버전 | 목적                                      |
| -------------------- | --------- | ----------------------------------------- |
| `/pantry`            | `icon`    | 식재료를 작은 아이콘으로 빠르게 훑는 목록 |
| `/pantry?view=image` | `image`   | 식재료 사진을 중심으로 인지하는 목록      |

디자인이 확정되면 선택되지 않은 버전과 분기만 제거하고, 선택된 카드 컴포넌트를 기본값으로 고정합니다.

### 다음 기능의 권장 배치

| 기능                           | 권장 시작 위치                      | 함께 만들 항목                                                      |
| ------------------------------ | ----------------------------------- | ------------------------------------------------------------------- |
| 팬트리 무한 스크롤             | `features/load-more-pantry-items`   | cursor 상태, Intersection Observer, 로딩 카드, MSW 다음 페이지 응답 |
| 식재료 등록·수정               | `features/manage-pantry-item`       | React Hook Form, Zod schema, 등록/수정 mutation                     |
| 레시피 찜                      | `features/toggle-recipe-save`       | 낙관적 업데이트, 저장 상태 UI                                       |
| 레시피 부족 재료 장바구니 담기 | `features/add-recipe-items-to-cart` | 레시피 맥락, 장바구니 mutation                                      |
| 카카오·네이버 로그인           | `features/auth`                     | callback 처리, 세션 초기화, 보호 라우트                             |
| REST API 호출                  | `src/shared/lib/api`                | fetch client, 공통 응답 파싱, `credentials: 'include'`              |
| 서버 데이터 캐싱               | `src/shared/lib/query`              | TanStack Query key·query/mutation option                            |

## 개발 원칙

- 디자인 기준은 **390 × 844 CSS px**이며, 실제 구현은 **360~430px** 범위에서 반응형으로 동작해야 합니다.
- 정상 상태뿐 아니라 로딩, 빈 데이터, 오류, 미인증 상태를 함께 구현합니다.
- 팬트리 상태는 색상만으로 표현하지 않고 텍스트·아이콘·배지를 함께 사용합니다.
- 아이콘 전용 버튼에는 접근 가능한 이름을 제공하고, 정보성 이미지에는 의미 있는 대체 텍스트를 제공합니다.
- 레시피에서 장바구니에 담긴 상품은 레시피 맥락을 유지해야 합니다.
- REST API 명세를 프론트엔드·백엔드·MSW의 공통 기준으로 사용합니다.

## Husky 커밋 훅

`npm install` 시 Husky가 자동 설정됩니다. 커밋 전 `.husky/pre-commit`이 아래 검사를 수행합니다.

```text
npm run format:check → npm run lint → npm run typecheck
```

검사에 실패하면 커밋이 중단됩니다. 긴 테스트와 프로덕션 빌드는 PR 검증 단계에서 실행합니다.

`.husky/commit-msg`는 `[type] 제목 (#이슈번호)` 형식이 아닌 커밋 메시지를 차단합니다. PR에서는 GitHub Actions가 브랜치·이슈 연결·품질 검사를 다시 실행합니다.

## 관련 문서

| 문서                                                                    | 설명                                       |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| [AGENTS.md](AGENTS.md)                                                  | 사람과 AI 작업자를 위한 프로젝트 작업 규칙 |
| [SKILLS.md](SKILLS.md)                                                  | 화면 구현, API·MSW, 성능·접근성 작업 흐름  |
| [MVP 범위](docs/product/mvp-scope.md)                                   | 팬트리 상태, 핵심 흐름, 화면 우선순위      |
| [프론트엔드 아키텍처](docs/architecture/frontend-architecture.md)       | 상태 소유권, BFF, PWA 기준                 |
| [REST API·MSW 계약 가이드](docs/api/contract-guidelines.md)             | API 명세와 MSW 운영 원칙                   |
| [개발 품질 자동화](docs/architecture/development-quality-automation.md) | Husky, CI, Ruleset 운영 기준               |
| [디자인 시스템](docs/design/design-system.md)                           | 토큰 계층, 테마, 공용 UI 사용 기준         |

## 브랜치와 풀 리퀘스트

- 브랜치 이름은 `Type/#issue-number/description` 형식을 사용합니다.
- 하나의 PR은 하나의 사용자 대면 결과에 집중합니다.
- UI 변경 시 360px, 390px, 430px에서 확인한 결과를 PR에 포함합니다.
- `.env`, 토큰, 개인 정보, 민감한 운영 URL은 커밋하지 않습니다.
