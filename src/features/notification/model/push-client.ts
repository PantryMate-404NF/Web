import { firebaseApp, firebaseVapidKey } from '@/shared/config/firebase';

function canUseBrowserPush() {
  return (
    typeof window !== 'undefined' &&
    typeof Notification !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'indexedDB' in window
  );
}

async function getMessagingModule() {
  if (!canUseBrowserPush() || !firebaseApp || !firebaseVapidKey) return null;

  const messagingModule = await import('firebase/messaging');

  if (!(await messagingModule.isSupported())) return null;

  return messagingModule;
}

/** 브라우저가 Firebase Web Push에 필요한 기능을 지원하는지 확인합니다. */
export async function isPushSupported() {
  return Boolean(await getMessagingModule());
}

async function getFcmToken(messagingModule: typeof import('firebase/messaging')) {
  if (!firebaseApp || !firebaseVapidKey) return null;

  const registration = await navigator.serviceWorker.register('/sw.js');
  const messaging = messagingModule.getMessaging(firebaseApp);

  return messagingModule.getToken(messaging, {
    vapidKey: firebaseVapidKey,
    serviceWorkerRegistration: registration,
  });
}

/** 이미 알림 권한이 허용된 브라우저에서 앱 실행 시 토큰을 가져옵니다. */
export async function getTokenForGrantedPermission(): Promise<string | null> {
  if (!canUseBrowserPush() || Notification.permission !== 'granted') return null;

  const messagingModule = await getMessagingModule();
  if (!messagingModule) return null;

  return getFcmToken(messagingModule);
}

/** 사용자 동작으로 알림 권한을 요청한 뒤 허용된 경우에만 FCM 토큰을 가져옵니다. */
export async function requestPushPermissionAndGetToken(): Promise<string | null> {
  if (!canUseBrowserPush() || !firebaseApp || !firebaseVapidKey) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const messagingModule = await getMessagingModule();
  if (!messagingModule) return null;

  return getFcmToken(messagingModule);
}
