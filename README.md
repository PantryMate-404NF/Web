# PantryMate Web

PantryMate는 식재료를 팬트리에 기록하고, 보유 재료와 사용자 취향을 바탕으로 레시피를 탐색한 뒤 부족한 재료를 주문할 수 있는 모바일 우선 웹 서비스입니다.

| Profile | GitHub | 역할 |
| :---: | :---: | :---: |
| <img src="https://github.com/seongjinss555.png" width="90" /> | [https://github.com/seongjinss555](https://github.com/seongjinss555) | 팀장
| <img src="https://github.com/JiWoongE.png" width="90" /> | [https://github.com/JiWoongE](https://github.com/JiWoongE) | 팀원

## 주요 기능

| 영역 | 구현 내용 |
| --- | --- |
| 홈 | 개인화 레시피 추천과 상품·기획전 영역을 제공합니다. |
| 레시피 | 레시피 탐색·검색·상세 조회, 팬트리 보유 재료 확인, 부족 재료의 상품 연결, 레시피 저장을 지원합니다. |
| 장바구니 | 상품 추가·수량 변경·삭제와 선택 상품 주문을 지원합니다. 레시피 상세에서도 선택한 재료 또는 부족한 재료를 장바구니에 추가할 수 있습니다. |
| 팬트리 | 식재료 목록 조회, 검색·정렬·보관 방법 필터, 직접 등록·수정·삭제를 지원합니다. |
| 영수증 OCR | 영수증을 전송해 상품명을 인식하고, 사용자가 결과를 확인·수정한 뒤 팬트리에 등록할 수 있습니다. |
| 주문·결제 | 주문서 작성, 결제 준비·승인, 주문 완료·실패 화면을 제공합니다. 결제 연동에는 토스페이먼츠 SDK를 사용합니다. |
| 마이페이지 | 프로필·개인화 설정·배송지·주문 내역을 확인하고 주문 상세 및 취소 흐름으로 이동할 수 있습니다. |
| 배송 조회 | 주문 내역의 실제 주문 상품을 표시하고, 배송 준비 또는 배송 완료 상태 화면을 제공합니다. |
| 알림 | Firebase 웹 푸시 설정이 있으면 브라우저 알림 권한을 요청하고 디바이스 토큰을 등록합니다. |
| PWA | 웹 앱 Manifest와 서비스 워커 등록을 지원합니다. |

## 주요 화면 경로

| 경로 | 화면 |
| --- | --- |
| `/` | 홈 |
| `/search` | 상품 검색 |
| `/product/[productId]` | 상품 상세 |
| `/recipe` | 레시피 목록·추천 |
| `/recipe/imminent` | 소비기한 임박 재료 관련 레시피 |
| `/recipe/ingredients` | 레시피 재료 선택 |
| `/recipe/more` | 레시피 더 보기 |
| `/recipe/[recipeId]` | 레시피 상세 |
| `/pantry` | 팬트리 목록 및 식재료 관리 |
| `/cart` | 장바구니 |
| `/order` | 주문서 |
| `/payment/success` | 결제 완료 |
| `/payment/fail` | 결제 실패 |
| `/onboarding` | 개인화 설정 |
| `/mypage` | 마이페이지 |
| `/mypage/orders` | 주문 내역 |
| `/mypage/orders/[orderId]` | 주문 상세 |
| `/mypage/orders/preparing` | 배송 준비 주문 |
| `/mypage/orders/completed` | 배송 완료 주문 |
| `/mypage/delivery` | 배송 상태 및 주문 상품 |
| `/mypage/addresses` | 배송지 목록 |
| `/mypage/addresses/new` | 배송지 등록 |
| `/mypage/addresses/[addressId]/edit` | 배송지 수정 |
| `/mypage/favorites` | 즐겨찾기 |
| `/mypage/scraps` | 저장한 레시피 |
| `/mypage/edit` | 프로필 수정 |
| `/login` | 로그인 |
| `/auth/callback` | 인증 콜백 |
| `/promotion` | 기획전 |

## 현재 동작과 범위

- 팬트리의 등록 출처는 `AUTO`, `MANUAL`, `OCR`로 구분합니다. 화면에는 각각 `자사몰에서 구입`, `사용자 등록`, `영수증 등록`으로 표시합니다.
- 팬트리 등록·수정 화면은 보관 방법과 날짜 정보를 관리합니다. 소비기한 상태와 남은 일수 표시는 팬트리 API 응답을 기준으로 처리합니다.
- 결제 완료 후 프론트엔드는 구매 상품을 팬트리에 다시 등록하는 API를 별도로 호출하지 않습니다. 결제한 상품의 자동 팬트리 반영 여부는 백엔드의 주문 처리와 응답 데이터에 따릅니다.
- 레시피에서 선택 담기를 하면 선택한 재료에 연결된 상품만 추가 요청을 보냅니다. 현재는 기존 미결제 장바구니 상품을 비우지 않으므로, 기존 상품과 새 상품이 장바구니에 함께 표시됩니다.
- 배송 조회 화면은 주문 내역의 상품 정보를 사용합니다. 택배사 실시간 배송 위치를 조회하는 연동은 포함되어 있지 않습니다.
- 정확한 식재료 잔여 수량 추정과 공유 팬트리·공유 장바구니는 구현 범위에 포함되어 있지 않습니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프레임워크 | Next.js `16.3.1`, React `19.2.8`, TypeScript `6.0.3` |
| 스타일 | Tailwind CSS `4.3.3`, Radix UI |
| 서버 상태 | TanStack Query `5.101.4` |
| 클라이언트 상태 | Zustand `5.0.15` |
| 폼·검증 | React Hook Form `7.85.0`, Zod `4.4.3` |
| API 모킹 | MSW `2.15.0` |
| 결제 | 토스페이먼츠 SDK `2.8.1` |
| 푸시 알림 | Firebase `12.19.0` |
| 테스트 | Vitest `4.1.11` |
| 코드 품질 | ESLint, Prettier, Husky |

## 시작하기

### 요구 환경

- Node.js 20 이상
- npm

### 설치 및 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 백엔드 API와 결제·푸시 기능을 사용하려면 `.env.local`에 해당 서비스 설정을 입력해야 합니다.

### 주요 환경 변수

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 브라우저가 호출하는 API 주소 |
| `BACKEND_API_BASE_URL` | 서비스별 주소 대신 사용할 통합 백엔드 주소 |
| `AUTH_API_BASE_URL` | 인증 API 주소 |
| `PANTRY_RECIPE_API_BASE_URL` | 팬트리·레시피 API 주소 |
| `PRODUCT_API_BASE_URL` | 상품 API 주소 |
| `NEXT_PUBLIC_CART_WRITE_API_ENABLED` | `enabled`이면 백엔드 장바구니 API에 변경 사항을 저장 |
| `NEXT_PUBLIC_API_MOCKING` | `enabled`이면 로컬 MSW 목업을 사용 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스페이먼츠 테스트 클라이언트 키 |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase 웹 푸시 설정 |

API 기본 주소 및 환경별 설정 예시는 [.env.example](.env.example)을 참고하세요. 실제 키와 비밀 값이 포함된 `.env.local`은 저장소에 커밋하지 않습니다.

개발 환경에서 장바구니 API 쓰기를 활성화하지 않으면 브라우저 로컬 미리보기 모드가 사용될 수 있습니다. 다른 브라우저나 기기와 장바구니를 공유하려면 백엔드 장바구니 API를 설정해야 합니다.

## 주요 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run format:check` | Prettier 포맷 검사 |
| `npm run check:design-tokens` | 디자인 토큰 검사 |
| `npm run check:token-usage` | 토큰 사용 검사 |
| `npm run check:mobile-layout` | 모바일 레이아웃 검사 |
| `npm run check` | 디자인 토큰·포맷·린트·타입 통합 검사 |
| `npm run test` | Vitest 테스트 실행 |
| `npm run build` | 프로덕션 빌드 전 검사 후 webpack 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run check:workflow` | 브랜치·커밋·작업 트리 검사 |

## 프로젝트 구조

FSD(Feature-Sliced Design) 의존 방향에 따라 화면과 기능을 배치합니다.

```text
src/
├── app/          # Next.js App Router, 라우트와 전역 설정
├── views/        # URL 단위 화면 조합
├── widgets/      # 여러 기능·도메인을 묶는 UI
├── features/     # 사용자 행동과 기능 흐름
├── entities/     # 팬트리·상품·레시피·주문·사용자 도메인
├── shared/       # 공통 API, 설정, UI, 유틸리티
├── components/   # 공용 UI 및 PWA 서비스 워커 등록
└── mocks/        # MSW 설정, 응답 데이터, API 핸들러

public/           # 이미지, 아이콘, 폰트, 서비스 워커
docs/             # 제품·아키텍처·API·개발 문서
```

상위 레이어는 하위 레이어를 참조할 수 있지만, 하위 레이어에서 상위 레이어를 참조하지 않습니다. Next.js App Router의 `app/` 아래에 실제 라우트를 두고, 페이지 단위 화면 구성은 `views/`에서 담당합니다.

## 개발 기준

- 모바일 화면을 우선으로 구현하며, 주요 UI는 폭 360~430 CSS px에서 확인합니다.
- 로딩·빈 결과·오류·미인증 상태를 함께 고려합니다.
- 아이콘만 있는 버튼에는 접근 가능한 이름을 제공하고, 의미가 있는 이미지에는 대체 텍스트를 작성합니다.
- API 응답과 프론트엔드 화면 모델은 DTO와 매퍼를 통해 분리합니다.
- REST API 명세를 프론트엔드와 MSW 응답의 기준으로 사용합니다.

## 관련 문서

| 문서 | 설명 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | 프로젝트 작업 규칙 |
| [SKILLS.md](SKILLS.md) | 화면·API·MSW·성능·접근성 작업 지침 |
| [MVP 범위](docs/product/mvp-scope.md) | 제품 범위와 우선순위 |
| [프론트엔드 아키텍처](docs/architecture/frontend-architecture.md) | 프론트엔드 구조와 상태 관리 기준 |
| [REST API·MSW 계약 가이드](docs/api/contract-guidelines.md) | API 명세와 MSW 운영 기준 |
| [개발 품질 자동화](docs/architecture/development-quality-automation.md) | 검사·CI·Git 훅 기준 |
| [디자인 시스템](docs/design/design-system.md) | 디자인 토큰과 공용 UI 기준 |

## 브랜치와 풀 리퀘스트

- 브랜치 이름은 `Type/#issue-number/description` 형식을 사용합니다.
- 하나의 PR은 하나의 사용자 대면 결과에 집중합니다.
- UI 변경은 360px, 390px, 430px 너비에서 확인합니다.
- `.env`, 토큰, 개인정보, 민감한 운영 URL은 커밋하지 않습니다.
