# FE·PD 핸드오프 상태 규칙 적용 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PD·FE 핸드오프에서 확정된 상태 기준을 공용 UI와 팬트리 화면에 안전하게 적용한다.

**Architecture:** 공용 상태는 `src/shared/model`에 타입으로만 제공한다. 기존 Button의 `disabled`와 Skeleton의 접근성 처리를 재사용하고, Pantry는 이미 가진 Loading·Empty·Error 분기를 유지하면서 재시도 콜백을 선택적으로 받는다.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Tailwind CSS, shadcn/ui Button

**Spec:** `docs/superpowers/specs/2026-09-03-fe-pd-handoff-state-adoption-design.md`

## Global Constraints

- Low-fi 화면의 시각 디자인, Toast, Spinner, 실제 API 연결은 추가하지 않는다.
- 중복 요청은 기존 Button의 `disabled` prop으로 막는다.
- PD 미확정 Retry CTA는 렌더링하지 않고 인터페이스만 제공한다.
- 모든 신규 동작은 테스트를 먼저 실패시킨 뒤 구현한다.

---

### Task 1: 공용 상태 모델

**Files:**

- Create: `src/shared/model/ui-state.ts`
- Create: `src/shared/model/ui-state.test.ts`

**Interfaces:**

- Produces: `DataViewState`, `InteractionState`

- [ ] **Step 1: 실패하는 상태 타입 사용 테스트를 작성한다.**

```ts
import type { DataViewState, InteractionState } from './ui-state';

const dataState: DataViewState = 'unauthorized';
const interactionState: InteractionState = 'loading';

expect(dataState).toBe('unauthorized');
expect(interactionState).toBe('loading');
```

- [ ] **Step 2: 테스트가 모듈 부재로 실패하는지 확인한다.**

Run: `npm run test -- src/shared/model/ui-state.test.ts`

- [ ] **Step 3: 최소 상태 타입을 구현한다.**

```ts
export type DataViewState = 'loading' | 'content' | 'empty' | 'error' | 'unauthorized';
export type InteractionState = 'default' | 'pressed' | 'disabled' | 'loading';
```

- [ ] **Step 4: 상태 타입 테스트를 통과시킨다.**

Run: `npm run test -- src/shared/model/ui-state.test.ts`

### Task 2: Skeleton과 Pantry 상태 접근성·재시도 인터페이스

**Files:**

- Modify: `src/views/pantry/ui/pantry-page.tsx`
- Modify: `src/views/pantry/ui/pantry-page.test.ts`

**Interfaces:**

- Consumes: `DataViewState`
- Produces: `PantryPageProps.onRetry?: () => void`

- [ ] **Step 1: Pantry retry 콜백 테스트를 작성한다.**

```tsx
render(<PantryPage errorMessage="오류" onRetry={onRetry} />);
await user.click(screen.getByRole('button', { name: '다시 시도' }));
expect(onRetry).toHaveBeenCalledOnce();
```

- [ ] **Step 2: retry 인터페이스 부재로 테스트가 실패하는지 확인한다.**

Run: `npm run test -- src/views/pantry/ui/pantry-page.test.ts`

- [ ] **Step 3: 최소 구현을 적용한다.**

```tsx
interface PantryPageProps {
  onRetry?: () => void;
}

<Button onClick={onRetry} type="button" variant="outline">
  다시 시도
</Button>;
```

- [ ] **Step 4: Error 상태에 접근성 속성을 추가한다.**

```tsx
<main aria-busy={viewState === 'loading'}>
<section role="alert">
```

- [ ] **Step 5: 관련 테스트를 통과시킨다.**

Run: `npm run test -- src/views/pantry/ui/pantry-page.test.ts`

### Task 3: 핸드오프 적용 문서화

**Files:**

- Create: `docs/design/fe-pd-handoff.md`
- Modify: `docs/api/screen-api-mapping.md`

**Interfaces:**

- Documents: 공용 상태 모델, 적용 위치, PD 확정 대기 항목

- [ ] **Step 1: 적용 문서를 작성한다.**

문서에는 데이터 상태와 인터랙션 상태의 차이, 코드 반영 위치, 현재 제외 범위, PD 확인 대기 항목을 기록한다.

- [ ] **Step 2: API 매핑 문서의 기준 섹션에 핸드오프 문서 링크를 추가한다.**

- [ ] **Step 3: 문서 링크와 Markdown 형식을 점검한다.**

Run: `git diff --check`

### Task 4: 전체 검증

**Files:**

- Verify: 변경된 모든 파일

- [ ] **Step 1: 관련 단위 테스트를 실행한다.**

Run: `npm run test -- src/shared/model/ui-state.test.ts src/views/pantry/ui/pantry-page.test.ts`

- [ ] **Step 2: 전체 검증을 실행한다.**

Run: `npm run check:design-tokens && npm run check:token-usage && npm run test && npm run lint && npm run typecheck && npm run build && git diff --check`

- [ ] **Step 3: 사용자 로컬 변경이 스테이징 또는 수정 대상에 포함되지 않았는지 확인한다.**

Run: `git status --short`
