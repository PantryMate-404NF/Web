# Prototype Wireframe Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Figma prototype의 팬트리·레시피·장바구니·조리 완료 흐름을 FSD 구조의 클릭 가능한 목업 라우트로 제공한다.

**Architecture:** App Router의 route 파일은 화면 진입만 담당하고, 화면 조합은 `views`, 재사용 가능한 화면 단위는 `widgets`, 화면이 소비하는 목업 도메인 데이터는 `entities`에 둔다. 서버 API나 실제 결제·배송·재고 차감은 연결하지 않으며, URL query로 목업 상태를 재현해 화면 전환과 빈·완료·확인 상태를 검증한다.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn/ui Button, Vitest

**Spec:** `docs/superpowers/specs/2026-08-28-pantry-list-wireframe-design.md`

## Global Constraints

- 기준 모바일 화면 폭은 390px이며, 360px부터 430px까지 가로 스크롤 없이 렌더링한다.
- 새 화면은 `src/app/(main)`, `src/views`, `src/widgets`, `src/entities`의 의존 방향을 따른다.
- 실제 API 호출, 실제 결제, 실제 배송 조회, 실제 재고 수량 차감은 목업 범위에 포함하지 않는다.
- `bg-background`, `bg-card`, `bg-muted`, `text-foreground` 등 의미 기반 토큰을 사용해 이후 디자인 토큰과 다크 모드 적용을 막지 않는다.
- 모든 버튼은 `button` 또는 링크 요소를 사용하고 `aria-label` 또는 화면에 보이는 이름을 제공한다.

---

## File Structure

- Create: `src/entities/recipe/model/types.ts` — 레시피와 필요 재료 목업 타입
- Create: `src/entities/recipe/model/mock.ts` — 추천 레시피·필요 재료 목업 데이터
- Create: `src/entities/cart/model/types.ts` — 장바구니 상품 타입
- Create: `src/entities/cart/model/mock.ts` — 장바구니 목업 데이터
- Create: `src/widgets/app-shell/ui/mobile-screen.tsx` — 모든 목업 화면의 390px 모바일 프레임과 상단바
- Create: `src/widgets/recipe-list/ui/recipe-card.tsx` — 레시피 목록 카드
- Create: `src/widgets/cart/ui/cart-item-row.tsx` — 장바구니 상품 행
- Create: `src/views/recipe/ui/recipe-list-page.tsx` — 주재료/소비기한 임박 레시피 화면
- Create: `src/views/recipe/ui/recipe-detail-page.tsx` — 레시피 상세와 부족 재료 담기 화면
- Create: `src/views/cart/ui/cart-page.tsx` — 장바구니와 주문 완료 진입 화면
- Create: `src/views/cooking/ui/cooking-complete-page.tsx` — 조리 완료 및 팬트리 확인 화면
- Create: `src/views/pantry/ui/pantry-flow-page.tsx` — 팬트리 빈 상태, 배송 자동 등록, 등록/수정, 삭제 확인을 조합
- Create: `src/app/(main)/recipe/page.tsx` — 레시피 목록 라우트
- Create: `src/app/(main)/recipe/[recipeId]/page.tsx` — 레시피 상세 라우트
- Create: `src/app/(main)/cart/page.tsx` — 장바구니 라우트
- Create: `src/app/(main)/cooking/complete/page.tsx` — 조리 완료 라우트
- Modify: `src/app/(main)/pantry/page.tsx` — 기존 팬트리 목록에 `state` query를 전달
- Modify: `src/app/(main)/page.tsx` — 목업 화면을 이동할 수 있는 시작 화면
- Test: `src/views/recipe/ui/recipe-list-page.test.ts`
- Test: `src/views/cart/ui/cart-page.test.ts`
- Test: `src/views/pantry/ui/pantry-flow-page.test.ts`

### Task 1: 화면 공통 프레임과 목업 도메인 모델 추가

**Files:**

- Create: `src/widgets/app-shell/ui/mobile-screen.tsx`
- Create: `src/entities/recipe/model/types.ts`
- Create: `src/entities/recipe/model/mock.ts`
- Create: `src/entities/cart/model/types.ts`
- Create: `src/entities/cart/model/mock.ts`

**Interfaces:**

- Produces: `MobileScreen({ title, backHref, action, children })`, `Recipe`, `recipeMocks`, `CartItem`, `cartItemMocks`

- [ ] **Step 1: 공통 프레임의 실패 테스트를 작성한다.**

```tsx
render(<MobileScreen title="레시피">본문</MobileScreen>);
expect(screen.getByRole('heading', { name: '레시피' })).toBeInTheDocument();
expect(screen.getByText('본문')).toBeInTheDocument();
```

- [ ] **Step 2: 테스트를 실행해 공통 프레임이 아직 없어 실패하는지 확인한다.**

Run: `npm run test -- mobile-screen`

Expected: `MobileScreen` 모듈을 찾을 수 없어 실패한다.

- [ ] **Step 3: 제목, 뒤로가기 링크, 우측 액션 슬롯을 가진 390px 프레임을 구현한다.**

```tsx
export function MobileScreen({ title, children }: MobileScreenProps) {
  return <main className="bg-background mx-auto min-h-dvh w-full max-w-[390px]">{children}</main>;
}
```

- [ ] **Step 4: 레시피와 장바구니가 소비할 최소 목업 데이터를 구현한다.**

```ts
export const recipeMocks: Recipe[] = [
  { id: 'kimchi-stew', name: '김치찌개', cookTime: '20분', missingCount: 2 },
];
export const cartItemMocks: CartItem[] = [
  { id: 'pork', name: '돼지고기 앞다리살', quantityLabel: '300g', price: 8900 },
];
```

- [ ] **Step 5: 공통 프레임 테스트를 다시 실행한다.**

Run: `npm run test -- mobile-screen`

Expected: PASS.

### Task 2: 팬트리 상태 목업을 기존 목록 화면에 연결

**Files:**

- Create: `src/views/pantry/ui/pantry-flow-page.tsx`
- Modify: `src/app/(main)/pantry/page.tsx`
- Test: `src/views/pantry/ui/pantry-flow-page.test.ts`

**Interfaces:**

- Consumes: `PantryPage`와 `MobileScreen`
- Produces: `PantryFlowPage({ state })`, 상태 값 `empty | full | delivery-complete | edit | delete-confirm`

- [ ] **Step 1: 팬트리 빈 상태와 배송 완료 상태의 실패 테스트를 작성한다.**

```tsx
render(<PantryFlowPage state="empty" />);
expect(screen.getByText('아직 등록된 식재료가 없어요')).toBeInTheDocument();

render(<PantryFlowPage state="delivery-complete" />);
expect(screen.getByRole('dialog', { name: '배송 완료 식재료 등록' })).toBeInTheDocument();
```

- [ ] **Step 2: 테스트를 실행해 화면 컴포넌트가 없어 실패하는지 확인한다.**

Run: `npm run test -- pantry-flow-page`

Expected: `PantryFlowPage` 모듈을 찾을 수 없어 실패한다.

- [ ] **Step 3: 상태별 팬트리 화면을 구현한다.**

```tsx
if (state === 'empty') return <EmptyPantry />;
if (state === 'delivery-complete')
  return (
    <PantryPage>
      <DeliveryDialog />
    </PantryPage>
  );
if (state === 'edit') return <IngredientForm />;
if (state === 'delete-confirm')
  return (
    <PantryPage>
      <DeleteBottomSheet />
    </PantryPage>
  );
return <PantryPage />;
```

- [ ] **Step 4: route에서 `searchParams.state`를 읽어 `PantryFlowPage`로 전달한다.**

```tsx
export default async function PantryRoute({ searchParams }: PantryRouteProps) {
  const { state } = await searchParams;
  return <PantryFlowPage state={state} />;
}
```

- [ ] **Step 5: 팬트리 테스트를 다시 실행한다.**

Run: `npm run test -- pantry-flow-page`

Expected: PASS.

### Task 3: 레시피 목록·상세·부족 재료 장바구니 진입 구현

**Files:**

- Create: `src/widgets/recipe-list/ui/recipe-card.tsx`
- Create: `src/views/recipe/ui/recipe-list-page.tsx`
- Create: `src/views/recipe/ui/recipe-detail-page.tsx`
- Create: `src/app/(main)/recipe/page.tsx`
- Create: `src/app/(main)/recipe/[recipeId]/page.tsx`
- Test: `src/views/recipe/ui/recipe-list-page.test.ts`

**Interfaces:**

- Consumes: `Recipe`, `recipeMocks`, `MobileScreen`
- Produces: `RecipeListPage({ tab })`, `RecipeDetailPage({ recipeId })`, `/recipe?tab=main|imminent`, `/recipe/[recipeId]`

- [ ] **Step 1: 레시피 탭과 카드 링크의 실패 테스트를 작성한다.**

```tsx
render(<RecipeListPage tab="imminent" />);
expect(screen.getByRole('tab', { name: '소비기한 임박' })).toHaveAttribute('aria-selected', 'true');
expect(screen.getByRole('link', { name: /김치찌개/ })).toHaveAttribute(
  'href',
  '/recipe/kimchi-stew',
);
```

- [ ] **Step 2: 테스트가 컴포넌트 부재로 실패하는지 확인한다.**

Run: `npm run test -- recipe-list-page`

Expected: `RecipeListPage` 모듈을 찾을 수 없어 실패한다.

- [ ] **Step 3: 주재료와 소비기한 임박 탭을 가진 레시피 목록을 구현한다.**

```tsx
<div role="tablist">
  <Link role="tab" aria-selected={tab === 'main'} href="/recipe?tab=main">
    주재료 레시피
  </Link>
  <Link role="tab" aria-selected={tab === 'imminent'} href="/recipe?tab=imminent">
    소비기한 임박
  </Link>
</div>
```

- [ ] **Step 4: 보유 재료·부족 재료·장바구니 담기 버튼을 갖춘 상세 화면을 구현한다.**

```tsx
<Link href="/cart?from=recipe" className="w-full">
  부족한 재료 장바구니에 담기
</Link>
```

- [ ] **Step 5: 목록 테스트를 다시 실행한다.**

Run: `npm run test -- recipe-list-page`

Expected: PASS.

### Task 4: 장바구니와 조리 완료 상태 구현

**Files:**

- Create: `src/widgets/cart/ui/cart-item-row.tsx`
- Create: `src/views/cart/ui/cart-page.tsx`
- Create: `src/views/cooking/ui/cooking-complete-page.tsx`
- Create: `src/app/(main)/cart/page.tsx`
- Create: `src/app/(main)/cooking/complete/page.tsx`
- Test: `src/views/cart/ui/cart-page.test.ts`

**Interfaces:**

- Consumes: `CartItem`, `cartItemMocks`, `MobileScreen`
- Produces: `CartPage({ from })`, `CookingCompletePage`, `/cart?from=recipe`, `/cooking/complete`

- [ ] **Step 1: 장바구니 합계와 주문 버튼의 실패 테스트를 작성한다.**

```tsx
render(<CartPage from="recipe" />);
expect(screen.getByText('레시피 부족 재료가 담겼어요')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /주문하기/ })).toBeInTheDocument();
```

- [ ] **Step 2: 테스트를 실행해 `CartPage`가 없어 실패하는지 확인한다.**

Run: `npm run test -- cart-page`

Expected: `CartPage` 모듈을 찾을 수 없어 실패한다.

- [ ] **Step 3: 상품 행, 수량, 합계, 주문 버튼을 가진 장바구니를 구현한다.**

```tsx
const totalPrice = cartItemMocks.reduce((total, item) => total + item.price, 0);
<button type="button">{totalPrice.toLocaleString()}원 주문하기</button>;
```

- [ ] **Step 4: 조리 완료 후 팬트리를 다시 확인하도록 안내하는 화면을 구현한다.**

```tsx
<Link href="/pantry?state=full">팬트리 상태 확인하기</Link>
```

- [ ] **Step 5: 장바구니 테스트를 다시 실행한다.**

Run: `npm run test -- cart-page`

Expected: PASS.

### Task 5: 시작 화면에서 전체 목업 흐름을 탐색 가능하게 만들고 검증

**Files:**

- Modify: `src/app/(main)/page.tsx`
- Modify: `README.md`

**Interfaces:**

- Consumes: 목업 route `/pantry`, `/recipe`, `/cart`, `/cooking/complete`
- Produces: 모든 프로토타입 목업의 진입 링크와 실행 방법 문서

- [ ] **Step 1: 시작 화면에 네 개 핵심 진입 링크의 실패 테스트를 작성한다.**

```tsx
expect(screen.getByRole('link', { name: '팬트리 목업' })).toHaveAttribute(
  'href',
  '/pantry?state=full',
);
expect(screen.getByRole('link', { name: '레시피 목업' })).toHaveAttribute('href', '/recipe');
```

- [ ] **Step 2: 시작 화면에 모바일 목업 진입 카드를 구현한다.**

```tsx
const mockRoutes = [{ label: '팬트리 목업', href: '/pantry?state=full' }];
```

- [ ] **Step 3: README에 각 목업 route와 query 상태 표를 추가한다.**

```md
| `/pantry?state=delivery-complete` | 배송 완료 자동 등록 팝업 |
| `/recipe?tab=imminent` | 소비기한 임박 레시피 |
```

- [ ] **Step 4: 전체 검증을 실행한다.**

Run: `npm run check && npm run test && npm run build`

Expected: 린트·타입·포맷·테스트·프로덕션 빌드가 모두 성공한다.

- [ ] **Step 5: 변경 사항을 커밋한다.**

```bash
git add src docs README.md
git commit -m "[feat] 프로토타입 목업 화면 구현 (#5)"
```
