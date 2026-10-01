# Pantry Recommendations and Delivered Orders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide pantry recipe recommendations for an empty pantry, and prepare a real delivered-orders view without fabricating undocumented backend behavior.

**Architecture:** Reuse the existing pantry-to-recipe ingredient resolution and recipe query. Keep delivery rendering on the existing order-history API/model; only add delivery states and route behavior after the backend contract is confirmed. Preserve `/mypage/delivery` as tracking detail.

**Tech Stack:** Next.js, React, TypeScript, TanStack Query, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-01-pantry-recommendations-delivered-orders.md`

## Global Constraints

- OCR consumption-date defaults are out of scope.
- No fabricated order counts or undocumented delivery status values.
- Do not client-create pantry items on delivery unless the backend contract explicitly requires it.
- Preserve the existing `/mypage/delivery` tracking route.

## Review Focus

- Pantry has zero rows: recommendation heading and section must both disappear.
- Pantry has a single valid item: recipes must be queried using that item's resolved ingredient ID.
- Pantry rows with missing ingredient mappings must not trigger an unfiltered recipe request.
- Unknown delivery status contracts must not be silently presented as delivered.
- Delivery completion must not cause duplicate pantry item creation.

---

### Task 1: Pantry-backed recipe section visibility

**Files:**

- Modify: `src/views/recipe/ui/recipe-list-page.tsx`
- Test: `src/views/recipe/ui/recipe-list-page.test.ts`
- Test: `src/views/recipe/ui/recipe-list-page-icon.test.tsx`

**Interfaces:**

- Consumes: `usePantriesQuery`, `getRecipePantryItemIds`, `useRecipesQuery`.
- Produces: the existing pantry recipe section is rendered only when there is at least one eligible pantry item or an explicit ingredient selection.

- [x] **Step 1: Write failing tests** for an empty pantry hiding the pantry-based recipe section and for a single pantry item triggering an ingredient-filtered recipe query.
- [x] **Step 2: Run the targeted tests** and verify the failures reflect the missing behavior.
- [x] **Step 3: Implement the smallest visibility/query-gating change** without changing personalized or general recipe sections.
- [x] **Step 4: Run targeted tests** and verify both empty and single-item cases pass.

### Task 2: Delivered-order API contract confirmation (blocking prerequisite)

**Files:**

- Review: `src/entities/order/api/order.dto.ts`
- Review: `src/entities/order/api/get-orders.ts`
- Review: `docs/api/backend-alignment-checklist.md`

**Interfaces:**

- Required inputs from backend: exact delivery status values, list-filter semantics, and whether delivery completion adds purchased ingredients to pantry.
- Produces: no code changes until those values are confirmed; then update the spec and add a separately testable implementation task for delivered list, summary counts, and pantry reflection.

- [ ] **Step 1: Confirm the backend contract** for delivery statuses, order-list filtering, and pantry synchronization.
- [ ] **Step 2: Update the spec and plan** with the confirmed enum values, routes, and source-of-truth behavior.
- [ ] **Step 3: Add failing API/model/UI tests** for the confirmed delivered-order behavior before implementation.
