import { registerDeviceToken } from '../api/register-device-token';
import {
  getTokenForGrantedPermission,
  isPushSupported,
  requestPushPermissionAndGetToken,
} from './push-client';

export type NotificationPermissionResult =
  'registered' | 'permission-denied' | 'dismissed' | 'unsupported' | 'error';

/** 로그인 세션이 복구된 뒤 기존에 허용된 알림 토큰을 비차단 방식으로 갱신합니다. */
export async function registerTokenForSession(state: string): Promise<boolean> {
  if (state !== 'complete' && state !== 'onboarding') return false;

  try {
    const token = await getTokenForGrantedPermission();
    if (!token) return false;

    await registerDeviceToken(token);
    return true;
  } catch {
    return false;
  }
}

/** 사용자 동작으로 권한을 요청하고 허용되면 발급한 토큰을 백엔드에 등록합니다. */
export async function requestAndRegisterDeviceToken(): Promise<NotificationPermissionResult> {
  try {
    const token = await requestPushPermissionAndGetToken();

    if (!token) {
      if (typeof Notification === 'undefined') return 'unsupported';
      if (Notification.permission === 'denied') return 'permission-denied';
      if (!(await isPushSupported())) return 'unsupported';
      if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
        return 'unsupported';
      }
      return 'dismissed';
    }

    await registerDeviceToken(token);
    return 'registered';
  } catch {
    return 'error';
  }
}

export function getNotificationPermissionMessage(result: NotificationPermissionResult) {
  switch (result) {
    case 'registered':
      return '알림을 받을 수 있도록 설정했어요.';
    case 'permission-denied':
      return '브라우저 설정에서 알림 권한을 허용해 주세요.';
    case 'dismissed':
      return '알림 권한을 허용하면 팬트리 알림을 받을 수 있어요.';
    case 'unsupported':
      return '현재 브라우저에서는 푸시 알림을 사용할 수 없어요.';
    case 'error':
      return '알림 설정에 실패했어요. 잠시 후 다시 시도해 주세요.';
  }
}
