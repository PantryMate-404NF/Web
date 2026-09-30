# PWA FCM 알림 설계

## 목표

로그인한 사용자의 브라우저 FCM 토큰을 백엔드에 등록하고, 백그라운드에서 수신한 팬트리 리마인드 알림을 표시한 뒤 내부 화면으로 이동시킨다.

## 범위와 성공 조건

- 권한이 이미 허용된 로그인 사용자는 로그인 직후와 앱 실행 시 FCM 토큰을 `POST /api/notifications/device-token`으로 등록한다.
- 권한이 거부됐거나 브라우저가 Web Push를 지원하지 않으면 토큰 API를 호출하지 않으며 앱 렌더링을 방해하지 않는다.
- `PANTRY_REMINDER` data 메시지는 백그라운드에서 제목·본문·내부 링크를 포함한 시스템 알림으로 표시한다.
- 알림 클릭은 same-origin 내부 경로만 열거나 기존 탭을 활성화한다.

## 결정 사항

### 단일 서비스워커

이미 `public/sw.js`가 루트 범위에서 등록되어 있다. 새 `firebase-messaging-sw.js`를 추가하지 않고 이 파일을 FCM Messaging 서비스워커로 확장한다. 클라이언트의 `getToken` 호출에는 이미 등록된 `ServiceWorkerRegistration`을 전달한다. 따라서 두 서비스워커의 범위 충돌을 피한다.

`public` 파일은 Next.js 번들 대상이 아니므로 서비스워커에서는 Firebase compat SDK를 `importScripts`로 로드한다. 일반 애플리케이션 코드에서는 npm으로 설치한 Firebase 모듈 SDK를 사용한다.

### 클라이언트 경계

`src/features/notification/model/push-client.ts`는 브라우저에서만 동적 import로 Firebase Messaging을 로드한다. `isSupported()` 확인, 기존 서비스워커 등록 확보, 권한 확인, VAPID 키를 사용한 FCM 토큰 발급을 맡는다. SSR과 테스트 환경에서 `window`, `Notification`, `navigator`를 직접 평가하지 않는다.

`src/features/notification/api/register-device-token.ts`는 공통 `request()`로 `{ fcmToken }`을 전송한다. 현재 access token은 `AuthSessionProvider`의 `restoreAuthSession()` 중 재발급되어 메모리에 저장되므로, 세션 복구 후에만 이 API를 호출한다.

`src/features/notification/ui/device-token-registration.tsx`는 인증 상태가 `complete` 또는 `onboarding`인 경우에만 토큰 등록을 요청한다. 권한이 `granted`이면 앱 시작 시 자동 등록한다. `default` 권한에서는 팝업을 자동으로 열지 않고, 마이페이지의 `알림 받기` 버튼을 누른 경우에만 권한을 요청한다. `denied`, 미지원, 토큰 발급 실패, API 실패는 비차단으로 처리하고 인증 흐름을 막지 않는다.

### 서비스워커 메시지·클릭 처리

백그라운드 메시지의 `data`에서 `type`, `title`, `body`, `link`를 읽는다. `type === 'PANTRY_REMINDER'`일 때만 `showNotification`을 호출한다. 클릭 데이터는 `{ link }`로 저장한다.

`notificationclick`에서는 알림을 닫고 `link`를 `self.location.origin` 기준으로 해석한다. origin이 다르거나 경로가 `/`로 시작하지 않으면 `/pantry`로 대체한다. 동일 origin의 브라우저 탭이 있으면 해당 탭을 `navigate()` 후 `focus()`하고, 없으면 `clients.openWindow()`로 연다.

### Firebase 설정과 보안

사용자가 제공한 Firebase 웹 설정값과 VAPID 공개키를 클라이언트 코드와 서비스워커에 설정한다. 이 값들은 브라우저에 포함되는 공개 식별자다. Firebase Admin SDK 자격증명·서비스 계정 키는 프론트엔드에 절대 추가하지 않는다. 현재 배포 환경에서 같은 Firebase 프로젝트를 사용하므로 별도 Jenkins 빌드 인자는 추가하지 않는다.

## API 계약

```http
POST /api/notifications/device-token
Authorization: Bearer <access token>
Content-Type: application/json

{ "fcmToken": "..." }
```

성공 응답은 기존 `ApiResponse<void>` 규격을 사용한다. 400(`DEVICE-TOKEN-INVALID`)과 401은 앱을 중단하지 않으며, 다음 인증 세션에서 재시도한다.

## 파일 구조

- `src/shared/config/firebase.ts`: Firebase 앱 설정 및 singleton 초기화
- `src/features/notification/model/push-client.ts`: 지원 여부·권한·FCM 토큰 발급
- `src/features/notification/api/register-device-token.ts`: 기기 토큰 등록 API
- `src/features/notification/ui/device-token-registration.tsx`: 인증 완료 후 비차단 등록 트리거
- `src/features/auth/ui/auth-session-provider.tsx`: 인증 Provider 내부에 토큰 등록 트리거 마운트
- `src/views/mypage/ui/my-page-page.tsx`: 사용자 동작으로 알림 권한을 요청하는 버튼
- `public/sw.js`: FCM background message 및 notification click 처리
- Firebase 웹 설정값은 `src/shared/config/firebase.ts`와 `public/sw.js`에서 동일하게 유지한다.

## 오류 처리

| 상태                    | 처리                                 |
| ----------------------- | ------------------------------------ |
| 권한 거부               | 토큰 발급·API 요청 생략              |
| 권한 미결정             | 자동 팝업 미표시, 설정 UI에서만 요청 |
| FCM 미지원              | 조용히 종료                          |
| FCM 토큰 없음/발급 실패 | 조용히 종료, 다음 앱 실행에 재시도   |
| 토큰 등록 API 실패      | 앱 흐름 유지, 다음 앱 실행에 재시도  |
| 유효하지 않은 알림 링크 | `/pantry`로 대체                     |

## 테스트 전략

- SSR 또는 브라우저 Push API 미지원 환경에서 FCM 동작을 안전하게 생략하는지 테스트한다.
- 권한별로 토큰 발급과 API 호출 여부를 테스트한다.
- `fcmToken` 요청 body와 인증 공통 클라이언트 사용을 테스트한다.
- 알림 payload의 타입과 내부 링크 정규화 함수를 테스트한다.
- 세션 등록 로직이 guest/loading 상태를 무시하고 인증된 상태에서만 등록하는지, 마이페이지 opt-in 동작이 노출되는지 테스트한다.

## 범위 밖

- Firebase Admin SDK 및 백엔드 알림 발송 로직
- 영수증 OCR 알림
- 포그라운드 메시지 토스트 UI
- 사용자가 알림 권한을 다시 허용하도록 유도하는 설정 화면 UI
