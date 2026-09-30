# Pantry and Recipe API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect recipe detail and saved-recipe flows to the documented backend APIs while preserving the already-working pantry and recipe-list API foundations.

**Architecture:** Keep the existing `views → entities/api → shared/api` flow. Add the missing recipe-detail mapping and server-owned scrap-list query, then use those Query results and mutations in the existing pages. Remove local/mock state as a substitute for server data; leave capabilities absent from the supplied OpenAPI explicitly unsupported instead of inventing endpoints.

**Tech Stack:** Next.js App Router, React, TypeScript, TanStack Query, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-27-pantry-recipe-api-integration-design.md`

## Global Constraints

- Use the existing `NEXT_PUBLIC_API_BASE_URL` and shared authenticated HTTP client; do not hard-code the OpenAPI `localhost:8082` server URL.
- Treat the attached OpenAPI as the backend contract: recipe detail is `GET /api/recipes/{recipeId}`; scraps are `GET /api/recipes/scraps`, `POST /api/recipes/{recipeId}/scrap`, and `DELETE /api/recipes/{recipeId}/scrap`.
- Preserve the existing pantry query and CRUD mutation flows; do not regress them while integrating recipe pages.
- Do not display mock records as successful API results while queries are pending or failed.
- Do not invent APIs for image upload, receipt OCR, pantry-based matching/recommendation, product linking, or popularity metrics.
- Preserve existing page layouts where supported by returned fields; nullable thumbnail and step image URLs must render safely.

## Review Focus

- A pending or failed recipe query must not flash mock content — test query loading/error UI on list, more, and scraps pages.
- An invalid or unavailable recipe ID must show a retryable not-found/error state, not another recipe's detail — test detail query 404 behavior.
- Scrap mutation failure must not change the displayed saved state; successful changes must synchronize list, detail, and `/mypage/scraps` — test both success and failure paths.
- Missing thumbnail/step images and empty ingredient/step arrays must not break rendering — test nullable/empty API DTO mapping.
- Multiple pantry items with the same name must not be silently deleted as a side effect of recipe completion — test completion does not invoke pantry deletion without a supported explicit mapping.

---

### Task 1: Recipe detail DTO mapping and scrap-list query

**Files:**

- Modify: `src/entities/recipe/model/types.ts`
- Modify: `src/entities/recipe/api/recipe.dto.ts`
- Modify: `src/entities/recipe/api/recipe.mapper.ts`
- Create: `src/entities/recipe/api/get-scrapped-recipes.ts`
- Create: `src/entities/recipe/api/use-scrapped-recipes-query.ts`
- Modify: `src/entities/recipe/api/use-recipe-mutations.ts`
- Test: `src/entities/recipe/api/recipe.mapper.test.ts`
- Test: `src/entities/recipe/api/recipe-api.test.ts`

**Interfaces:**

- Produces: `toRecipeDetail(dto: RecipeDetailDto): RecipeDetail`
- Produces: `useScrappedRecipesQuery(): UseQueryResult<Recipe[]>`
- Produces: stable query keys for `['recipe', 'detail', recipeId]` and `['recipe', 'scraps']` used by Task 3.

- [ ] **Step 1: Write failing mapper tests** for recipe metadata, nullable thumbnail/step images, numeric ingredient IDs, amount/unit labels, and step ordering.
- [ ] **Step 2: Run `npm test -- src/entities/recipe/api/recipe.mapper.test.ts`** and confirm the detail mapper/model is missing.
- [ ] **Step 3: Implement the `RecipeDetail` UI model and `toRecipeDetail` mapper** without fabricating products, ownership, tips, or recipe metrics.
- [ ] **Step 4: Write failing API/query tests** that assert `GET /api/recipes/scraps` uses the shared request client and expected key.
- [ ] **Step 5: Implement the scraps request and Query hook** using `RecipeDto` and `toRecipe`.
- [ ] **Step 6: Run `npm test -- src/entities/recipe/api/recipe.mapper.test.ts src/entities/recipe/api/recipe-api.test.ts`** and confirm both suites pass.

### Task 2: Render recipe detail from the API

**Files:**

- Modify: `src/views/recipe/ui/recipe-detail-page.tsx`
- Modify: `src/views/recipe/ui/recipe-detail-page.test.tsx`
- Modify: `src/entities/recipe/api/use-recipe-detail-query.ts` (export/reuse the stable detail query key if needed)

**Interfaces:**

- Consumes: Task 1 `RecipeDetail`, `toRecipeDetail`, and `useRecipeDetailQuery(recipeId)`.
- Produces: detail UI driven by the requested recipe response, with loading, retryable error/not-found, and content states.

- [ ] **Step 1: Add failing tests** proving the requested recipe's title, category, time, thumbnail, ingredients, and ordered steps render from API data, while loading/error states do not show the existing fixed recipe.
- [ ] **Step 2: Run `npm test -- src/views/recipe/ui/recipe-detail-page.test.tsx`** and observe failure because the page is static.
- [ ] **Step 3: Replace hard-coded recipe content with the detail query response** and render optional images defensively.
- [ ] **Step 4: Remove the false pantry-cleanup success flow from cooking completion**; keep the documented cooking-history mutation and report only that result, because the supplied API does not define recipe-to-pantry cleanup matching.
- [ ] **Step 5: Run the focused detail-page tests** and verify they pass.

### Task 3: Make scrapping server-owned across pages

**Files:**

- Modify: `src/views/recipe/ui/recipe-detail-page.tsx`
- Modify: `src/views/recipe/ui/recipe-list-page.tsx`
- Modify: `src/views/mypage/ui/scrapped-recipes-page.tsx`
- Modify: `src/views/mypage/ui/scrapped-recipes-page.test.tsx`
- Test: `src/views/recipe/ui/recipe-detail-page.test.tsx`
- Test: `src/views/recipe/ui/recipe-list-page.test.tsx`

**Interfaces:**

- Consumes: Task 1 `useScrappedRecipesQuery`, stable scraps query key, and `useRecipeMutations()`.
- Produces: scrap button state sourced from API results; successful mutations invalidate scrap-list and recipe list/detail queries; failures retain server state and show feedback.

- [ ] **Step 1: Replace local-store expectation tests** with UI tests for server-sourced state, mutation success, and mutation failure on detail and recipe cards.
- [ ] **Step 2: Run focused tests and observe failure** while current UI only toggles Zustand state.
- [ ] **Step 3: Wire add/remove buttons to the corresponding POST/DELETE mutation** and invalidate affected query keys only after success.
- [ ] **Step 4: Change `/mypage/scraps` to render the scraps Query result** with pending, empty, error/retry, and content states; remove local IDs and mock-list fallback from that page.
- [ ] **Step 5: Run focused recipe and Mypage tests** and confirm cross-page behavior.

### Task 4: Stop presenting mock recipe data as API content

**Files:**

- Modify: `src/entities/recipe/model/types.ts`
- Modify: `src/entities/recipe/api/recipe.mapper.ts`
- Modify: `src/views/recipe/ui/recipe-list-page.tsx`
- Modify: `src/views/recipe/ui/recipe-more-page.tsx`
- Test: `src/views/recipe/ui/recipe-list-page.test.ts`
- Test: `src/views/recipe/ui/recipe-list-page-icon.test.tsx`

**Interfaces:**

- Consumes: Task 1 recipe mapper/query results and Task 3 server scrap state.
- Produces: cards use API `thumbnailUrl` where present, client search filters fetched recipes, and list/more pages show explicit loading/error/empty states without mock fallback.

- [ ] **Step 1: Write failing tests** for thumbnail propagation, pending/error without mock cards, empty API results, and client-side search over actual API results.
- [ ] **Step 2: Run focused list tests and observe failure** on pending/mock fallback and discarded thumbnail fields.
- [ ] **Step 3: Map `thumbnailUrl` into the recipe model and remove mock fallback from list/more pages.** Keep only API-supported list content; do not label the same unranked response as review-, scrap-, or share-ranked data.
- [ ] **Step 4: Add pending, empty, and retryable error UI to more pages** and preserve existing back navigation.
- [ ] **Step 5: Run focused list/more tests and confirm they pass.**

### Task 5: Full verification and integration audit

**Files:**

- Test: all pantry, recipe, and Mypage tests.
- Verify: all modified API and UI files.

**Interfaces:** Tasks 1–4 are complete.

- [ ] **Step 1: Run targeted pantry regression tests** for list, create, update, delete, and route states.
- [ ] **Step 2: Run `npm test -- --exclude '.worktrees/**'`** and confirm all test files pass.
- [ ] **Step 3: Run `npm run check`** and confirm formatting, lint, and typecheck pass.
- [ ] **Step 4: Run `env NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 npm run build`** and confirm production build succeeds.
- [ ] **Step 5: Review the diff** for accidental mock fallbacks, unsupported API paths, unrelated changes, and modified generated files; restore generated-only changes.
