# 프론트엔드 아키텍처

## FSD 구조와 의존 방향

프로젝트는 Feature-Sliced Design을 사용합니다. `src/app`은 라우팅과 전역 설정만 담당하며, 페이지 조합은 `src/views`, 큰 재사용 UI 블록은 `src/widgets`에 둡니다. 사용자 행동은 `src/features`, 도메인 모델은 `src/entities`, 공통 코드는 `src/shared`에 둡니다.

```text
app → views → widgets → features → entities → shared
```

상위 레이어만 하위 레이어를 import할 수 있습니다. 특정 화면의 문맥이 필요한 코드는 `shared`에 두지 않습니다.

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

## PWA 기준

첫 단계에서는 Manifest, 아이콘, 설치 가능 구조, 서비스 워커 등록만 제공한다. 주문·팬트리·장바구니 API 응답은 캐시하지 않는다. 오프라인 범위가 확정되면 정적 자산부터 제한적으로 캐싱한다.
