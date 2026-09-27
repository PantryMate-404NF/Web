# PWA FCM Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register authenticated users' FCM web push tokens and display/click through pantry reminder notifications in the existing PWA.

**Architecture:** Keep the existing root-scoped `/sw.js` and pass its `ServiceWorkerRegistration` to Firebase Messaging. Use the modular Firebase SDK only in browser code, register tokens after auth restoration when permission is already granted, and expose an explicit Mypage action for users to grant permission.

**Tech Stack:** Next.js App Router, React, Firebase JS SDK Messaging, Vitest, existing shared HTTP client.

**Spec:** `docs/superpowers/specs/2026-09-22-pwa-fcm-notifications-design.md`

## Global Constraints

- Keep a single root-scoped service worker at `/sw.js`.
- Register only with notification permission `granted`; request permission only after explicit user action.
- Never let unsupported browsers, permission denial, or push API failures block app/auth rendering.
- Send `POST /api/notifications/device-token` with `{ fcmToken }` through the shared authenticated `request()` helper.
- Open same-origin paths only from notification clicks; fallback to `/pantry`.
- Firebase client settings and VAPID public key are public config; do not add Admin SDK credentials.

## Review Focus

- SSR or unsupported browsers must not evaluate browser-only Firebase Messaging code.
- Permission `default` must not trigger an unsolicited browser prompt during app startup.
- Permission `denied` must not issue a token-registration API request.
- API 400/401 or network errors must not escape into authentication/session UI.
- Malformed or cross-origin notification links must not navigate outside the app.

---

### Task 1: Device-token API contract

**Files:**

- Create: `src/features/notification/api/register-device-token.ts`
- Test: `src/features/notification/api/register-device-token.test.ts`

**Interfaces:**

- Produces: `registerDeviceToken(fcmToken: string): Promise<void>` using `request<void>('/api/notifications/device-token', { method: 'POST', body: { fcmToken } })`.

- [ ] **Step 1: Write the failing tests** for exact POST path/body/authenticated request and propagation of API errors.
- [ ] **Step 2: Run** `npm test -- src/features/notification/api/register-device-token.test.ts`; expected: tests fail because the module is missing.
- [ ] **Step 3: Implement** the typed API wrapper through `@/shared/api/http-client`.
- [ ] **Step 4: Re-run** the targeted test; expected: all contract cases pass.

### Task 2: Firebase client and permission-aware token acquisition

**Files:**

- Create: `src/shared/config/firebase.ts`
- Create: `src/features/notification/model/push-client.ts`
- Test: `src/features/notification/model/push-client.test.ts`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**

- Produces: `requestPushPermissionAndGetToken(): Promise<string | null>`; it checks browser support, asks permission only when directly invoked, ensures `/sw.js` is registered, and passes the registration and VAPID public key to Firebase `getToken()`.
- Produces: `getTokenForGrantedPermission(): Promise<string | null>`; it returns `null` unless permission is already `granted` and does not prompt.

- [ ] **Step 1: Install** the Firebase JS SDK dependency.
- [ ] **Step 2: Write failing tests** for unsupported/SSR return, denied/default no-prompt behavior on auto registration, explicit permission request, and reuse of `/sw.js` registration when obtaining a token.
- [ ] **Step 3: Run** `npm test -- src/features/notification/model/push-client.test.ts`; expected: tests fail because the module is missing.
- [ ] **Step 4: Implement** public Firebase config from the provided Firebase web settings, initialize one Firebase app, and lazy-load browser Messaging after support checks.
- [ ] **Step 5: Run** the targeted tests; expected: no prompt during automatic registration and a token only after permission is granted.

### Task 3: Authenticated automatic registration and user opt-in

**Files:**

- Create: `src/features/notification/ui/device-token-registration.tsx`
- Test: `src/features/notification/ui/device-token-registration.test.tsx`
- Modify: `src/features/auth/ui/auth-session-provider.tsx`
- Modify: `src/views/mypage/ui/my-page-page.tsx`
- Test: `src/views/mypage/ui/my-page-page.test.ts` (or existing dedicated test)

**Interfaces:**

- Consumes: Task 1 `registerDeviceToken` and Task 2 `getTokenForGrantedPermission`, `requestPushPermissionAndGetToken`.
- Produces: a side-effect-only registration component that registers after auth state becomes `complete` or `onboarding`; a Mypage action lets a signed-in user explicitly request permission and register.

- [ ] **Step 1: Write failing tests** asserting guest/loading state does not register, authenticated state with granted permission registers, and explicit Mypage action requests permission and reports the resulting state without breaking the page.
- [ ] **Step 2: Run** the two targeted test files; expected: missing component/action behavior fails.
- [ ] **Step 3: Implement** the side-effect component inside `AuthSessionProvider` and an `알림 받기` control under Mypage account management. Keep all failures non-blocking and show concise inline status only after a user action.
- [ ] **Step 4: Run** the targeted tests; expected: auth and opt-in behavior passes.

### Task 4: Background message display and notification click navigation

**Files:**

- Modify: `public/sw.js`
- Test: `public/sw.test.ts`

**Interfaces:**

- Consumes: FCM `data` payload fields `type`, `title`, `body`, and `link`.
- Produces: a `PANTRY_REMINDER` notification whose click focuses/navigates an existing same-origin client or opens a new same-origin window.

- [ ] **Step 1: Write failing service-worker harness tests** that execute the actual `public/sw.js` with stubbed `self`, `clients`, and Firebase compat objects. Assert ignored message types show no notification; pantry reminder shows its data; a same-origin path navigates to that route; an external/malformed link falls back to `/pantry`.
- [ ] **Step 2: Run** `npm test -- public/sw.test.ts`; expected: the current service worker has no messaging/click handlers and fails these behavior assertions.
- [ ] **Step 3: Implement** compat Firebase Messaging initialization using the provided public Firebase config, `onBackgroundMessage`, `showNotification()`, and same-origin-only `notificationclick` routing.
- [ ] **Step 4: Run** the targeted test; expected: all service-worker behavior cases pass.

### Task 5: Full verification and review

**Files:** no additional planned changes.

- [ ] Run `npm test -- --exclude '.worktrees/**'`; expected: all project test files pass.
- [ ] Run `npm run check`; expected: design/token checks, formatting, lint, and typecheck pass.
- [ ] Run `npm run build`; expected: optimized production build completes.
- [ ] Review the diff against `origin/develop`, checking all five Review Focus conditions and that no Firebase Admin credential or unrelated change is present.
