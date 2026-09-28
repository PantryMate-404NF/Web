import { request } from '@/shared/api/http-client';

interface RegisterDeviceTokenRequest {
  fcmToken: string;
}

/** 로그인 사용자의 브라우저 FCM 토큰을 백엔드에 등록합니다. */
export function registerDeviceToken(fcmToken: string) {
  const body: RegisterDeviceTokenRequest = { fcmToken };

  return request<void>('/api/notifications/device-token', {
    method: 'POST',
    body,
  });
}
