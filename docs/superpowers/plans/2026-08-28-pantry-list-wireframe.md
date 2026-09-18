# Pantry List Wireframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 피그마 와이어프레임을 따르는 반응형 팬트리 목록 화면과 네 가지 화면 상태를 구현한다.

**Architecture:** `app` 라우트는 `views` 화면만 연결한다. 도메인 타입·목업 데이터·카드 UI는 `entities/pantry`가 소유하며, 화면 전용 조합 블록은 `widgets/pantry-list`에 둔다. 디자인 확정 전에는 의미 기반 CSS 토큰과 Lucide 아이콘을 사용한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, lucide-react

**Spec:** `docs/superpowers/specs/2026-08-28-pantry-list-wireframe-design.md`

## Global Constraints

- 390×844는 디자인 기준이며 360px·390px·430px에서 가로 스크롤이 없어야 한다.
- 소비기한 상태와 요리 가능 여부는 별도 값으로 유지한다.
- 실제 API·MSW handler·식재료 변경 기능은 이번 범위에서 제외한다.
- 색상은 `background`, `card`, `muted`, `foreground` 계열 의미 기반 토큰만 사용한다.

---

### Task 1: 팬트리 도메인 모델과 목업 데이터

**Files:**

- Create: `src/entities/pantry/model/types.ts`
- Create: `src/entities/pantry/model/mock.ts`
- Test: `src/entities/pantry/model/mock.test.ts`

**Interfaces:**

- Produces: `PantryItem`, `PantryAvailability`, `ExpirationStatus`, `pantryItems`

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
import { pantryItems } from './mock';

test('목업 항목은 고유 식별자와 독립적인 소비기한·요리 가능 상태를 가진다', () => {
  expect(pantryItems.length).toBeGreaterThan(0);
  expect(new Set(pantryItems.map((item) => item.id)).size).toBe(pantryItems.length);
  expect(pantryItems[0]).toEqual(
    expect.objectContaining({
      expirationStatus: expect.any(String),
      availability: expect.any(String),
    }),
  );
});
```

- [ ] **Step 2: 테스트가 모듈 부재로 실패하는지 확인**

Run: `npm run test -- src/entities/pantry/model/mock.test.ts`

- [ ] **Step 3: 타입과 8개 이상의 목업 식재료 구현**

```ts
export interface PantryItem {
  id: string;
  name: string;
  expirationLabel: string;
  expirationStatus: ExpirationStatus;
  availability: PantryAvailability;
  imageAlt: string;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test -- src/entities/pantry/model/mock.test.ts`

### Task 2: 카드와 목록 위젯 구현

**Files:**

- Create: `src/entities/pantry/ui/pantry-item-card.tsx`
- Create: `src/widgets/pantry-list/ui/pantry-header.tsx`
- Create: `src/widgets/pantry-list/ui/pantry-toolbar.tsx`
- Create: `src/widgets/pantry-list/ui/pantry-grid.tsx`

**Interfaces:**

- Consumes: `PantryItem` from `entities/pantry/model/types`
- Produces: `PantryItemCard`, `PantryHeader`, `PantryToolbar`, `PantryGrid`

- [ ] **Step 1: 카드의 상태 문구를 반환하는 실패 테스트 작성**

```ts
import { getExpirationStatusLabel } from './pantry-item-card';

test('소비기한 임박 상태를 사용자 문구로 변환한다', () => {
  expect(getExpirationStatusLabel('IMMINENT')).toBe('소비기한 임박');
});
```

- [ ] **Step 2: 테스트가 export 부재로 실패하는지 확인**

Run: `npm run test -- src/entities/pantry/ui/pantry-item-card.test.ts`

- [ ] **Step 3: 카드와 위젯을 의미 기반 토큰으로 구현**

카드는 이미지 자리, 식재료명, 소비기한 정보, 상태 배지를 보여 주며 44px 아이콘 버튼을 제공한다. `PantryGrid`는 `grid-cols-2 gap-3`을 사용한다.

- [ ] **Step 4: 카드 테스트 통과 확인**

Run: `npm run test -- src/entities/pantry/ui/pantry-item-card.test.ts`

### Task 3: 화면 상태와 라우트 연결

**Files:**

- Create: `src/views/pantry/ui/pantry-page.tsx`
- Create: `src/app/(main)/pantry/page.tsx`
- Test: `src/views/pantry/ui/pantry-page.test.ts`

**Interfaces:**

- Consumes: `pantryItems`, `PantryHeader`, `PantryToolbar`, `PantryGrid`
- Produces: `/pantry` 화면과 `default`, `loading`, `empty`, `error` 상태 렌더링

- [ ] **Step 1: 빈 상태와 오류 상태의 실패 테스트 작성**

```ts
test('빈 팬트리에는 등록 유도 문구를 보여 준다', () => {
  expect(getPantryViewState({ items: [], isLoading: false })).toBe('empty');
});

test('오류가 있으면 오류 상태를 우선한다', () => {
  expect(
    getPantryViewState({ items: [], isLoading: false, errorMessage: '불러오지 못했습니다.' }),
  ).toBe('error');
});
```

- [ ] **Step 2: 테스트가 함수 부재로 실패하는지 확인**

Run: `npm run test -- src/views/pantry/ui/pantry-page.test.ts`

- [ ] **Step 3: 상태 판별 함수와 화면 구현**

`error > loading > empty > default` 순서로 상태를 판별한다. 기본 화면에는 `pantryItems`를 전달하고, 다른 상태는 별도 콘텐츠를 렌더링한다.

- [ ] **Step 4: 테스트와 라우트 빌드 통과 확인**

Run: `npm run test -- src/views/pantry/ui/pantry-page.test.ts && npm run build`

### Task 4: 전체 검증과 PR 준비

**Files:**

- Modify: `README.md` (필요한 경우에만 팬트리 라우트 추가)

- [ ] **Step 1: 전체 품질 검사 실행**

Run: `npm run check && npm run check:workflow && npm run test && npm run build`

- [ ] **Step 2: 360px·390px·430px에서 수동 화면 확인**

Run: `npm run dev`

- [ ] **Step 3: 커밋과 PR 생성**

```bash
git add src docs
git commit -m "[feat] 팬트리 목록 와이어프레임 구현 (#5)"
git push -u origin 'Feat/#5/pantry-list-wireframe'
```

PR 본문에는 `Closes #5`를 넣고, API 연동은 목업 데이터 기반임을 명시한다.

## Self-review

- Spec coverage: 라우트, 2열 그리드, 네 가지 상태, 반응형 제약, 의미 기반 토큰이 Task 1~4에 모두 포함된다.
- Placeholder scan: 구현 단계에 결정되지 않은 API와 디자인 에셋은 명시적으로 제외했으며, 구현 세부 사항이 비어 있는 단계는 없다.
- Type consistency: `PantryItem`, `pantryItems`, `PantryGrid`, `getPantryViewState` 이름을 모든 단계에서 동일하게 사용한다.
