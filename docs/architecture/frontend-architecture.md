# 프론트엔드 아키텍처

## FSD 구조와 의존 방향

프로젝트는 Feature-Sliced Design을 사용합니다. `src/app`은 라우팅과 전역 설정만 담당하며, 페이지 조합은 `src/views`, 큰 재사용 UI 블록은 `src/widgets`에 둡니다. 사용자 행동은 `src/features`, 도메인 모델은 `src/entities`, 공통 코드는 `src/shared`에 둡니다.

```text
app → views → widgets → features → entities → shared
```

상위 레이어만 하위 레이어를 import할 수 있습니다. 특정 화면의 문맥이 필요한 코드는 `shared`에 두지 않습니다.

## 디자인 시스템 소유권

`src/app/globals.css`는 색상, 타이포그래피, spacing, radius, shadow, 라이트·다크 semantic 토큰의 단일 소스입니다. 화면은 primitive 값을 직접 사용하지 않고 semantic 토큰을 사용합니다. 재사용 가능한 버튼·입력창·카드의 상태 조합은 `src/shared/ui`가 소유하며, 화면 문맥이 필요한 조합은 `widgets`, `features`, `entities`에 둡니다.

토큰 정의와 사용 규칙은 [디자인 시스템](../design/design-system.md)을 기준으로 합니다. 신규 semantic 또는 component 토큰을 추가하면 `globals.css`, 공용 컴포넌트, 해당 문서를 같은 변경 단위로 갱신합니다.

## 상태 소유권

| 상태         | 위치                  | 예시                                 |
| ------------ | --------------------- | ------------------------------------ |
| 서버 상태    | TanStack Query        | 팬트리, 레시피, 상품, 장바구니, 주문 |
| URL 상태     | Search Params         | 검색어, 필터, 정렬                   |
| 전역 UI 상태 | Zustand               | 바텀시트, 토스트, 임시 선택          |
| 폼 상태      | React Hook Form + Zod | 팬트리 확인, 알림 설정               |
| 지역 UI 상태 | React `useState`      | 카드 펼침, 입력 중 수량              |

## BFF 기준

단일 도메인 CRUD와 장바구니 변경은 백엔드 API를 직접 호출한다. 홈 대시보드처럼 팬트리·레시피·재구매 후보를 한 화면에 조합해야 할 때만 `src/app/api` Route Handler를 BFF로 사용한다.

## 인증 기준

MVP 로그인 제공자는 카카오와 네이버뿐이다. 프론트엔드는 제공자 선택 화면과 로그인 완료 후 상태 갱신을 담당하고, OAuth 인가 코드 교환·제공자 비밀 값 관리·서비스 토큰 발급은 백엔드가 담당한다. 자체 이메일 로그인 화면과 비밀번호 관련 폼은 만들지 않는다.

로그인 완료 응답의 사용자 식별은 `provider: KAKAO | NAVER`와 제공자 사용자 식별자를 사용한다. Access Token·Refresh Token의 전달 및 갱신 방식은 백엔드 API 계약에서 확정한다.

## PWA 기준

첫 단계에서는 Manifest, 아이콘, 설치 가능 구조, 서비스 워커 등록만 제공한다. 주문·팬트리·장바구니 API 응답은 캐시하지 않는다. 오프라인 범위가 확정되면 정적 자산부터 제한적으로 캐싱한다.
