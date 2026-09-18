# 팬트리 목록 와이어프레임 설계

## 목적

피그마 `iPhone 13 & 14_PANTRY Full`(node `811:1240`)을 기준으로, 확정 전 디자인 토큰과 에셋에 의존하지 않는 팬트리 목록 화면을 구현한다. 화면은 실제 REST API가 준비되기 전 목업 데이터로 동작하며, 이후 API·공용 컴포넌트·디자인 토큰을 교체해도 화면 구조를 유지해야 한다.

## 범위

- `GET /pantry`에서 팬트리 목록을 표시한다.
- 상단 헤더, 보유 식재료 수, 필터 버튼, 2열 카드 그리드, 기본·로딩·빈·오류 상태를 제공한다.
- 카드에는 식재료 이미지 자리, 이름, 소비기한 보조 정보, 요리 가능 상태를 표시한다.
- 360px, 390px, 430px 뷰포트에서 가로 스크롤 없이 동작한다.
- 라이트·다크 모드가 도입될 것을 고려하여 의미 기반 Tailwind 토큰만 사용한다.

## 제외 범위

- 실제 식재료 추가·삭제·수정, 필터 바텀시트, 서버 API 연동, MSW handler, 다크 모드 토글은 이번 이슈에 포함하지 않는다.
- 피그마 에셋 다운로드와 실제 이미지 적용은 디자인 확정 이후 처리한다.

## 컴포넌트 경계

```text
src/app/(main)/pantry/page.tsx        라우트 연결만 담당
src/views/pantry/ui/pantry-page.tsx   화면 상태와 조합
src/entities/pantry/model/types.ts    PantryItem 및 상태 타입
src/entities/pantry/model/mock.ts     화면용 목업 데이터
src/entities/pantry/ui/pantry-item-card.tsx
src/widgets/pantry-list/ui/pantry-header.tsx
src/widgets/pantry-list/ui/pantry-toolbar.tsx
src/widgets/pantry-list/ui/pantry-grid.tsx
```

`app → views → widgets → entities → shared` 의존 방향을 따른다. `PantryItemCard`는 도메인 UI이므로 `entities`에 둔다. 화면 전용 헤더·툴바·그리드는 `widgets`에 둔다.

## 데이터 모델

```ts
type PantryAvailability = 'AVAILABLE' | 'UNAVAILABLE';
type ExpirationStatus = 'NORMAL' | 'IMMINENT' | 'EXPIRED' | 'UNREGISTERED';

interface PantryItem {
  id: string;
  name: string;
  expirationLabel: string;
  expirationStatus: ExpirationStatus;
  availability: PantryAvailability;
  imageAlt: string;
}
```

소비기한 상태와 요리 가능 여부는 분리한다. 소비기한이 경과해도 화면이 자동으로 요리 불가로 단정하지 않는다.

## 화면 상태

| 상태    | 표시 기준           | 화면 동작                    |
| ------- | ------------------- | ---------------------------- |
| 기본    | 항목 1개 이상       | 2열 카드 그리드              |
| 로딩    | `isLoading=true`    | 카드 형태에 맞는 스켈레톤 UI |
| 빈 상태 | `items=[]`          | 팬트리 등록 유도 문구        |
| 오류    | `errorMessage` 존재 | 오류 설명과 다시 시도 버튼   |

## 스타일 원칙

- 카드: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`를 사용한다.
- 임시 이미지: `bg-muted`를 사용한다.
- 페이지: `mx-auto w-full max-w-[430px]` 기반 모바일 우선 레이아웃으로 구현한다.
- 클릭 가능한 버튼과 카드 내 아이콘 버튼은 44px 이상의 터치 영역을 확보한다.
- 실제 디자인 토큰과 다크 테마가 확정될 때 색상 변수와 아이콘만 교체한다.

## 완료 기준

- 피그마 와이어프레임의 헤더, 필터 영역, 2열 카드 간격과 정보 계층이 구현된다.
- 모든 화면 상태가 목업 데이터로 확인된다.
- `npm run check`, `npm run check:workflow`, `npm run test`, `npm run build`가 통과한다.
